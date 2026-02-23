/**
 * GET /api/integrations/notion/callback?code=xxxx&state=user_id
 *
 * Notion OAuth callback handler:
 *   a) Extract code and state (= user_id) from query params
 *   b) Verify logged-in user matches state
 *   c) Exchange code for token:
 *      POST https://api.notion.com/v1/oauth/token
 *      Headers: Basic auth with NOTION_CLIENT_ID:NOTION_CLIENT_SECRET (base64)
 *      Body: { grant_type: 'authorization_code', code, redirect_uri }
 *      Response: { access_token, workspace_id, workspace_name, bot_id, ... }
 *   d) Encrypt access_token using AES-256-GCM
 *   e) Upsert into Supabase integrations table:
 *      { user_id, type: 'notion', enabled: true, oauth_token: encrypted,
 *        extra: { workspace_id, workspace_name } }
 *   f) Redirect to /dashboard/integrations?connected=notion
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNotionConfig, notionCallbackUrl } from "@/lib/oauth/providers";
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

    // ── Exchange code for token (Basic Auth) ───────────────────────────────
    const config = getNotionConfig();

    try {
        // Notion requires Basic Auth: base64(client_id:client_secret)
        const basicAuth = Buffer.from(
            `${config.clientId}:${config.clientSecret}`
        ).toString("base64");

        const tokenRes = await fetch(config.tokenUrl, {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code,
                redirect_uri: notionCallbackUrl(),
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenRes.ok || tokenData.error) {
            console.error("Notion token exchange failed:", tokenData);
            dashboardUrl.searchParams.set(
                "error",
                tokenData.error ?? "token_exchange_failed"
            );
            return NextResponse.redirect(dashboardUrl);
        }

        // ── Extract data ─────────────────────────────────────────────────────
        const accessToken = tokenData.access_token as string;
        const workspaceId = tokenData.workspace_id as string | undefined;
        const workspaceName = tokenData.workspace_name as string | undefined;
        const botId = tokenData.bot_id as string | undefined;

        if (!accessToken) {
            dashboardUrl.searchParams.set("error", "no_access_token");
            return NextResponse.redirect(dashboardUrl);
        }

        // ── Encrypt token ────────────────────────────────────────────────────
        const encryptedAccess = encrypt(accessToken);

        const now = new Date().toISOString();

        const extra = {
            workspace_id: workspaceId ?? null,
            workspace_name: workspaceName ?? null,
            bot_id: botId ?? null,
        };

        // ── Upsert into integrations table ───────────────────────────────────
        const { data: existing } = await supabase
            .from("integrations")
            .select("id")
            .eq("user_id", userId)
            .eq("type", "notion")
            .maybeSingle();

        if (existing) {
            await supabase
                .from("integrations")
                .update({
                    oauth_token: encryptedAccess,
                    refresh_token: null,  // Notion doesn't use refresh tokens
                    token_expires_at: null,  // Notion tokens don't expire
                    enabled: true,
                    connected_at: now,
                    extra,
                    updated_at: now,
                })
                .eq("id", existing.id);
        } else {
            await supabase.from("integrations").insert({
                user_id: userId,
                type: "notion",
                oauth_token: encryptedAccess,
                refresh_token: null,
                token_expires_at: null,
                enabled: true,
                connected_at: now,
                extra,
                updated_at: now,
            });
        }

        // ── Success → redirect back to dashboard ─────────────────────────────
        dashboardUrl.searchParams.set("connected", "notion");
        return NextResponse.redirect(dashboardUrl);

    } catch (err) {
        console.error("Notion OAuth callback error:", err);
        dashboardUrl.searchParams.set("error", "server_error");
        return NextResponse.redirect(dashboardUrl);
    }
}
