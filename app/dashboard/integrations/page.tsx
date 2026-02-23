import { getUser } from "@/actions/get-user";
import { getUserSubscription } from "@/actions/get-user-subscription";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IntegrationsGrid } from "@/components/dashboard/integrations-grid";

function derivePlan(productId?: string | null): "starter" | "personal" | "teams" {
    if (!productId) return "starter";
    if (productId.toLowerCase().includes("team")) return "teams";
    if (productId.toLowerCase().includes("personal")) return "personal";
    return "starter";
}

export default async function IntegrationsPage({
    searchParams,
}: {
    searchParams: Promise<{ connected?: string; success?: string; error?: string }>;
}) {
    const [userRes, subRes] = await Promise.all([
        getUser(),
        getUserSubscription(),
    ]);
    if (!userRes.success) redirect("/login");

    const plan = derivePlan(
        subRes.success ? subRes.data.subscription?.productId : null
    );

    // Fetch ALL integrations for this user (enabled and disabled)
    const supabase = await createClient();
    const { data: userIntegrations } = await supabase
        .from("integrations")
        .select("id, type, enabled, connected_at")
        .eq("user_id", userRes.data.id);

    const resolvedParams = await searchParams;
    const connectedProvider = resolvedParams.connected ?? resolvedParams.success;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                    Integrations
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Connect your tools so your agent can act on your behalf.
                </p>
            </div>

            {/* Success banner from OAuth callback */}
            {connectedProvider && (
                <div className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm font-medium text-emerald-700 flex items-center gap-2">
                    <span className="text-lg">✅</span>
                    <span>
                        <span className="capitalize font-bold">{connectedProvider}</span>{" "}
                        connected successfully!
                        {connectedProvider === "gmail" && (
                            <span className="text-emerald-600/80">
                                {" "}(Google Calendar & Drive also activated)
                            </span>
                        )}
                    </span>
                </div>
            )}

            {/* Error banner */}
            {resolvedParams.error && (
                <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-sm font-medium text-red-700 flex items-center gap-2">
                    <span className="text-lg">❌</span>
                    <span>
                        Connection failed:{" "}
                        <span className="font-mono text-xs">{resolvedParams.error}</span>
                    </span>
                </div>
            )}

            <IntegrationsGrid
                plan={plan}
                connectedTypes={
                    (userIntegrations ?? [])
                        .filter((i) => i.enabled)
                        .map((i) => i.type)
                }
            />
        </div>
    );
}
