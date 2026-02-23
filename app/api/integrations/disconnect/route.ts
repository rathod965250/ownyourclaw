/**
 * POST /api/integrations/disconnect
 * Body: { "provider": "gmail" }
 *
 * Disables the integration (sets enabled=false, clears tokens).
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { provider } = body;

    if (!provider || typeof provider !== "string") {
        return NextResponse.json({ error: "Missing provider" }, { status: 400 });
    }

    const { error } = await supabase
        .from("integrations")
        .update({
            enabled: false,
            oauth_token: null,
            refresh_token: null,
            token_expires_at: null,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("type", provider);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
