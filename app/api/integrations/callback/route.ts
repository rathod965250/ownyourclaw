/**
 * GET /api/integrations/callback?code=...&state=...
 *
 * Step 2 of OAuth:
 *   1. Verify `state` matches cookie (CSRF protection)
 *   2. Exchange `code` for access_token + refresh_token
 *   3. Encrypt both tokens
 *   4. Upsert into Supabase `integrations` table
 *   5. Redirect user back to /dashboard/integrations?success=provider
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
    getProviderConfig,
    callbackUrl,
    type OAuthProvider,
} from "@/lib/oauth/providers";
import { encrypt } from "@/lib/oauth/encryption";

export async function GET(req: NextRequest) {
    const cookieStore = await cookies();

    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");
    const savedState = cookieStore.get("oauth_state")?.value;
    const provider = cookieStore.get("oauth_provider")?.value as OAuthProvider | undefined;
    const errorParam = req.nextUrl.searchParams.get("error");

    // Clean up cookies
    cookieStore.delete("oauth_state");
    cookieStore.delete("oauth_provider");

    const dashboardUrl = new URL("/dashboard/integrations", req.url);

    // ── Provider denied / error ────────────────────────────────────────────
    if (errorParam) {
        dashboardUrl.searchParams.set("error", errorParam);
        return NextResponse.redirect(dashboardUrl);
    }

    // ── Validation ─────────────────────────────────────────────────────────
    if (!code || !state || !savedState || state !== savedState) {
        dashboardUrl.searchParams.set("error", "invalid_state");
        return NextResponse.redirect(dashboardUrl);
    }

    if (!provider) {
        dashboardUrl.searchParams.set("error", "missing_provider");
        return NextResponse.redirect(dashboardUrl);
    }

    // ── Auth check ─────────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ── Exchange code → tokens ─────────────────────────────────────────────
    const config = getProviderConfig(provider);

    try {
        let tokenData: any;

        if (provider === "notion") {
            // Notion uses Basic Auth for token exchange
            const basic = Buffer.from(
                `${config.clientId}:${config.clientSecret}`
            ).toString("base64");

            const res = await fetch(config.tokenUrl, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${basic}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: callbackUrl(provider),
                }),
            });

            tokenData = await res.json();

            if (!res.ok || tokenData.error) {
                dashboardUrl.searchParams.set("error", tokenData.error ?? "token_exchange_failed");
                return NextResponse.redirect(dashboardUrl);
            }
        } else if (provider === "github") {
            // GitHub returns data as form-urlencoded (or JSON with Accept header)
            const res = await fetch(config.tokenUrl, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    code,
                    redirect_uri: callbackUrl(provider),
                }),
            });

            tokenData = await res.json();

            if (!res.ok || tokenData.error) {
                dashboardUrl.searchParams.set("error", tokenData.error ?? "token_exchange_failed");
                return NextResponse.redirect(dashboardUrl);
            }
        } else {
            // Google (Gmail / Calendar) — standard form POST
            const res = await fetch(config.tokenUrl, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: config.clientId,
                    client_secret: config.clientSecret,
                    code,
                    grant_type: "authorization_code",
                    redirect_uri: callbackUrl(provider),
                }),
            });

            tokenData = await res.json();

            if (!res.ok || tokenData.error) {
                dashboardUrl.searchParams.set("error", tokenData.error ?? "token_exchange_failed");
                return NextResponse.redirect(dashboardUrl);
            }
        }

        // ── Extract tokens ─────────────────────────────────────────────────
        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token ?? null;
        const expiresIn = tokenData.expires_in ?? null; // seconds

        const tokenExpiresAt = expiresIn
            ? new Date(Date.now() + expiresIn * 1000).toISOString()
            : null;

        // Notion also gives us workspace info
        const extra: Record<string, any> = {};
        if (provider === "notion") {
            extra.workspace_name = tokenData.workspace_name ?? null;
            extra.workspace_id = tokenData.workspace_id ?? null;
            extra.bot_id = tokenData.bot_id ?? null;
        }

        // ── Encrypt tokens ───────────────────────────────────────────────────
        const encryptedAccess = encrypt(accessToken);
        const encryptedRefresh = refreshToken ? encrypt(refreshToken) : null;

        // ── Upsert into integrations table ───────────────────────────────────
        // Check if this provider already exists for the user
        const { data: existing } = await supabase
            .from("integrations")
            .select("id")
            .eq("user_id", user.id)
            .eq("type", provider)
            .maybeSingle();

        const now = new Date().toISOString();

        if (existing) {
            // Update existing integration
            await supabase
                .from("integrations")
                .update({
                    oauth_token: encryptedAccess,
                    refresh_token: encryptedRefresh,
                    token_expires_at: tokenExpiresAt,
                    enabled: true,
                    connected_at: now,
                    extra: Object.keys(extra).length > 0 ? extra : undefined,
                    updated_at: now,
                })
                .eq("id", existing.id);
        } else {
            // Insert new integration
            await supabase.from("integrations").insert({
                user_id: user.id,
                type: provider,
                oauth_token: encryptedAccess,
                refresh_token: encryptedRefresh,
                token_expires_at: tokenExpiresAt,
                enabled: true,
                connected_at: now,
                extra: Object.keys(extra).length > 0 ? extra : {},
                updated_at: now,
            });
        }

        // ── Success → redirect to dashboard ──────────────────────────────────
        dashboardUrl.searchParams.set("success", provider);
        return NextResponse.redirect(dashboardUrl);

    } catch (err) {
        console.error("OAuth callback error:", err);
        dashboardUrl.searchParams.set("error", "server_error");
        return NextResponse.redirect(dashboardUrl);
    }
}
