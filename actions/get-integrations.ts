"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "./get-user";

export type Integration = {
    id: string;
    type: string;
    enabled: boolean;
    connected_at: string | null;
    last_used_at: string | null;
};

export async function getEnabledIntegrations() {
    try {
        const userRes = await getUser();
        if (!userRes.success) {
            return { success: false as const, error: "Not authenticated" };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("integrations")
            .select("id, type, enabled, connected_at, last_used_at")
            .eq("user_id", userRes.data.id)
            .eq("enabled", true);

        if (error) {
            return { success: false as const, error: error.message };
        }

        return { success: true as const, data: data ?? [] };
    } catch {
        return { success: false as const, error: "Failed to fetch integrations" };
    }
}
