/**
 * GET /api/integrations/google/callback?code=xxxx&state=user_id
 *
 * Google OAuth callback handler:
 *   a) Extract code and state (= user_id) from query params
 *   b) Exchange code for tokens:
 *      POST https://oauth2.googleapis.com/token
 *      Body: { code, client_id, client_secret, redirect_uri, grant_type }
 *      Response: { access_token, refresh_token, expires_in }
 *   c) Encrypt both tokens using AES-256-GCM
 *   d) Upsert into Supabase `integrations` table:
 *      → Row 1: type = 'gmail'
 *      → Row 2: type = 'google_calendar'
 *      (Same tokens work for both — scopes grant access to all 3 APIs)
 *   e) Redirect user to /dashboard/integrations?connected=gmail
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGoogleConfig, googleCallbackUrl } from "@/lib/oauth/providers";
import { encrypt } from "@/lib/oauth/encryption";

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get("code");
    const userId = req.nextUrl.searchParams.get("state");  // state = user_id
    const error = req.nextUrl.searchParams.get("error");

    const dashboardUrl = new URL("/dashboard/integrations", req.url);

    // ── User denied access ─────────────────────────────────────────────────
    if (error) {
        dashboardUrl.searchParams.set("error", error);
        return NextResponse.redirect(dashboardUrl);
    }

    // ── Validate params ────────────────────────────────────────────────────
    if (!code || !userId) {
        dashboardUrl.searchParams.set("error", "missing_params");
        return NextResponse.redirect(dashboardUrl);
    }

    // ── Verify the user is actually logged in and matches the state ────────
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
        dashboardUrl.searchParams.set("error", "auth_mismatch");
        return NextResponse.redirect(dashboardUrl);
    }

    // ── Exchange code for tokens ───────────────────────────────────────────
    const config = getGoogleConfig();

    try {
        const tokenRes = await fetch(config.tokenUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: config.clientId,
                client_secret: config.clientSecret,
                redirect_uri: googleCallbackUrl(),
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || tokenData.error) {
            console.error("Google token exchange failed:", tokenData);
            dashboardUrl.searchParams.set(
                "error",
                tokenData.error_description ?? tokenData.error ?? "token_exchange_failed"
            );
            return NextResponse.redirect(dashboardUrl);
        }

        const accessToken = tokenData.access_token as string;
        const refreshToken = tokenData.refresh_token as string | undefined;
        const expiresIn = tokenData.expires_in as number | undefined;

        if (!accessToken) {
            dashboardUrl.searchParams.set("error", "no_access_token");
            return NextResponse.redirect(dashboardUrl);
        }

        // ── Encrypt tokens ───────────────────────────────────────────────────
        const encryptedAccess = encrypt(accessToken);
        const encryptedRefresh = refreshToken ? encrypt(refreshToken) : null;

        const tokenExpiresAt = expiresIn
            ? new Date(Date.now() + expiresIn * 1000).toISOString()
            : null;

        const now = new Date().toISOString();

        // ── Upsert TWO rows: gmail + google_calendar ─────────────────────────
        // Same tokens work for both because we requested combined scopes.
        const types = ["gmail", "google_calendar"] as const;

        for (const type of types) {
            const { data: existing } = await supabase
                .from("integrations")
                .select("id")
                .eq("user_id", userId)
                .eq("type", type)
                .maybeSingle();

            if (existing) {
                await supabase
                    .from("integrations")
                    .update({
                        oauth_token: encryptedAccess,
                        refresh_token: encryptedRefresh,
                        token_expires_at: tokenExpiresAt,
                        enabled: true,
                        connected_at: now,
                        updated_at: now,
                    })
                    .eq("id", existing.id);
            } else {
                await supabase.from("integrations").insert({
                    user_id: userId,
                    type,
                    oauth_token: encryptedAccess,
                    refresh_token: encryptedRefresh,
                    token_expires_at: tokenExpiresAt,
                    enabled: true,
                    connected_at: now,
                    extra: {},
                    updated_at: now,
                });
            }
        }

        // ── Success → redirect back to dashboard ─────────────────────────────
        dashboardUrl.searchParams.set("connected", "gmail");
        return NextResponse.redirect(dashboardUrl);

    } catch (err) {
        console.error("Google OAuth callback error:", err);
        dashboardUrl.searchParams.set("error", "server_error");
        return NextResponse.redirect(dashboardUrl);
    }
}
