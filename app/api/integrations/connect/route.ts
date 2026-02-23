/**
 * GET /api/integrations/connect?provider=gmail|google_calendar|notion|github
 *
 * Step 1 of OAuth: redirects the user's browser to the provider's consent page.
 *
 * Google (gmail, google_calendar):
 *   → state = user_id → /api/integrations/google/callback
 *
 * Notion:
 *   → state = user_id → /api/integrations/notion/callback
 *
 * Others (github):
 *   → state = random CSRF (cookie) → /api/integrations/callback
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import {
    buildGoogleAuthorizeUrl,
    buildNotionAuthorizeUrl,
    buildAuthorizeUrl,
    type OAuthProvider,
} from "@/lib/oauth/providers";
import { randomBytes } from "crypto";

const VALID_PROVIDERS: OAuthProvider[] = [
    "gmail",
    "google_calendar",
    "notion",
    "github",
];

const GOOGLE_PROVIDERS = new Set(["gmail", "google_calendar"]);

export async function GET(req: NextRequest) {
    // ── 1. Auth check ───────────────────────────────────────────────────────
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // ── 2. Validate provider ────────────────────────────────────────────────
    const provider = req.nextUrl.searchParams.get("provider") as OAuthProvider;

    if (!provider || !VALID_PROVIDERS.includes(provider)) {
        return NextResponse.json(
            { error: `Invalid provider. Valid: ${VALID_PROVIDERS.join(", ")}` },
            { status: 400 }
        );
    }

    // ── 3. Google flow — state = user_id ───────────────────────────────────
    if (GOOGLE_PROVIDERS.has(provider)) {
        return NextResponse.redirect(buildGoogleAuthorizeUrl(user.id));
    }

    // ── 4. Notion flow — state = user_id ───────────────────────────────────
    if (provider === "notion") {
        return NextResponse.redirect(buildNotionAuthorizeUrl(user.id));
    }

    // ── 5. Generic flow (GitHub etc.) — state = CSRF cookie ────────────────
    const state = randomBytes(32).toString("hex");
    const cookieStore = await cookies();

    cookieStore.set("oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/",
    });

    cookieStore.set("oauth_provider", provider, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 600,
        path: "/",
    });

    const authorizeUrl = buildAuthorizeUrl(provider, state);
    return NextResponse.redirect(authorizeUrl);
}
