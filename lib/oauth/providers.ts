/**
 * OAuth provider configurations.
 *
 * Each provider defines:
 *   - clientId / clientSecret (from env)
 *   - authorizeUrl  →  browser redirect to grant consent
 *   - tokenUrl      →  server token exchange
 *   - scopes        →  what permissions we request
 *
 * GOOGLE is special: one consent screen grants access to Gmail +
 * Calendar + Drive, and the callback creates TWO integration rows.
 *
 * NOTION uses its own dedicated callback at /api/integrations/notion/callback
 * with state = user_id.
 */

export type OAuthProvider = "gmail" | "notion" | "github" | "google_calendar";

// "google" is the umbrella — used for the single consent redirect
export type OAuthFamily = OAuthProvider | "google";

interface ProviderConfig {
    clientId: string;
    clientSecret: string;
    authorizeUrl: string;
    tokenUrl: string;
    scopes: string[];
    /** Extra params to attach to the authorize URL */
    extraParams?: Record<string, string>;
}

function baseUrl(): string {
    return process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
}

/** Per-provider callback URL (Notion, GitHub, etc.) */
export function callbackUrl(provider: OAuthProvider): string {
    return `${baseUrl()}/api/integrations/callback?provider=${provider}`;
}

/** Google uses its own dedicated callback route */
export function googleCallbackUrl(): string {
    return `${baseUrl()}/api/integrations/google/callback`;
}

/** Notion uses its own dedicated callback route */
export function notionCallbackUrl(): string {
    return `${baseUrl()}/api/integrations/notion/callback`;
}

// ─── Google (single consent → gmail + calendar + drive) ──────────────────────

export function getGoogleConfig(): ProviderConfig {
    return {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        scopes: [
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/drive.readonly",
        ],
        extraParams: {
            access_type: "offline",   // → gives us a refresh_token
            prompt: "consent",   // force consent to always get refresh_token
        },
    };
}

// ─── Per-provider configs (non-Google) ───────────────────────────────────────

export function getProviderConfig(provider: OAuthProvider): ProviderConfig {
    switch (provider) {
        // Gmail / Calendar are handled by the unified Google flow
        case "gmail":
        case "google_calendar":
            return getGoogleConfig();

        // ── Notion ────────────────────────────────────────────────────────────
        case "notion":
            return getNotionConfig();

        // ── GitHub ─────────────────────────────────────────────────────────────
        case "github":
            return {
                clientId: process.env.GITHUB_CLIENT_ID ?? "",
                clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
                authorizeUrl: "https://github.com/login/oauth/authorize",
                tokenUrl: "https://github.com/login/oauth/access_token",
                scopes: ["repo", "read:user"],
            };

        default:
            throw new Error(`Unknown OAuth provider: ${provider}`);
    }
}

/**
 * Build the Google authorize URL.
 * state = user's Supabase user_id
 */
export function buildGoogleAuthorizeUrl(userId: string): string {
    const config = getGoogleConfig();
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: googleCallbackUrl(),
        response_type: "code",
        scope: config.scopes.join(" "),
        state: userId,          // ← user_id so callback knows who
        ...config.extraParams,
    });

    return `${config.authorizeUrl}?${params.toString()}`;
}

// ─── Notion ──────────────────────────────────────────────────────────────────

export function getNotionConfig(): ProviderConfig {
    return {
        clientId: process.env.NOTION_CLIENT_ID!,
        clientSecret: process.env.NOTION_CLIENT_SECRET!,
        authorizeUrl: "https://api.notion.com/v1/oauth/authorize",
        tokenUrl: "https://api.notion.com/v1/oauth/token",
        scopes: [],  // Notion manages permissions in integration settings
        extraParams: {
            owner: "user",
        },
    };
}

/**
 * Build the Notion authorize URL.
 * state = user's Supabase user_id
 */
export function buildNotionAuthorizeUrl(userId: string): string {
    const config = getNotionConfig();
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: notionCallbackUrl(),
        response_type: "code",
        owner: "user",
        state: userId,
    });

    return `${config.authorizeUrl}?${params.toString()}`;
}

/**
 * Build a generic authorize URL (GitHub, etc.)
 */
export function buildAuthorizeUrl(
    provider: OAuthProvider,
    state: string
): string {
    const config = getProviderConfig(provider);
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: callbackUrl(provider),
        response_type: "code",
        state,
        ...(config.scopes.length > 0 && { scope: config.scopes.join(" ") }),
        ...config.extraParams,
    });

    return `${config.authorizeUrl}?${params.toString()}`;
}
