"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "./get-user";

export type ScheduledTask = {
    id: string;
    name: string;
    description: string | null;
    cron_expression: string;
    enabled: boolean;
    next_run_at: string | null;
    last_run_at: string | null;
    last_run_status: string | null;
};

export async function getUpcomingTasks(limit = 3) {
    try {
        const userRes = await getUser();
        if (!userRes.success) {
            return { success: false as const, error: "Not authenticated" };
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from("scheduled_tasks")
            .select(
                "id, name, description, cron_expression, enabled, next_run_at, last_run_at, last_run_status"
            )
            .eq("user_id", userRes.data.id)
            .eq("enabled", true)
            .order("next_run_at", { ascending: true })
            .limit(limit);

        if (error) {
            return { success: false as const, error: error.message };
        }

        return { success: true as const, data: data ?? [] };
    } catch {
        return { success: false as const, error: "Failed to fetch tasks" };
    }
}
