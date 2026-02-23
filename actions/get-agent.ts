"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "./get-user";

export type Agent = {
    id: string;
    user_id: string;
    status: string | null;
    channel: string | null;
    agent_name: string | null;
    trigger_word: string | null;
    whatsapp_phone_number_id: string | null;
    whatsapp_status: string | null;
    telegram_bot_username: string | null;
    slack_team_name: string | null;
    message_count_today: number | null;
    last_message_at: string | null;
    onboarding_complete: boolean;
    created_at: string | null;
    updated_at: string | null;
};

export async function getAgent() {
    try {
        const userRes = await getUser();
        if (!userRes.success) {
            return { success: false as const, error: "Not authenticated" };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("agents")
            .select("*")
            .eq("user_id", userRes.data.id)
            .maybeSingle();

        if (error) {
            return { success: false as const, error: error.message };
        }

        return { success: true as const, data: (data as Agent | null) ?? null };
    } catch {
        return { success: false as const, error: "Failed to fetch agent" };
    }
}
