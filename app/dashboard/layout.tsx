import { redirect } from "next/navigation";
import { getUser } from "@/actions/get-user";
import { getUserSubscription } from "@/actions/get-user-subscription";
import { getAgent } from "@/actions/get-agent";
import { Sidebar } from "@/components/dashboard/sidebar";

// ─── Derive plan string from subscription product ID ─────────────────────────
// Adjust productId prefixes to match your Dodo Products setup.
function derivePlan(productId?: string | null): "starter" | "personal" | "teams" {
    if (!productId) return "starter";
    if (productId.toLowerCase().includes("team")) return "teams";
    if (productId.toLowerCase().includes("personal")) return "personal";
    return "starter";
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ── Auth guard ───────────────────────────────────────────────────────────────
    const userRes = await getUser();
    if (!userRes.success) redirect("/login");

    // ── Subscription guard ───────────────────────────────────────────────────────
    const subRes = await getUserSubscription();
    const hasActiveSub =
        subRes.success &&
        subRes.data.subscription !== null &&
        subRes.data.subscription.status === "active";

    if (!hasActiveSub) redirect("/#pricing");

    // ── Agent data (for sidebar + overview) ─────────────────────────────────────
    const agentRes = await getAgent();
    const agentName = agentRes.success ? agentRes.data?.agent_name : null;

    // ── Derive plan ──────────────────────────────────────────────────────────────
    const plan = derivePlan(
        subRes.success ? subRes.data.subscription?.productId : null
    );

    return (
        <div className="min-h-screen bg-background flex">
            {/* Fixed sidebar */}
            <Sidebar plan={plan} agentName={agentName} />

            {/* Scrollable main area — offset by sidebar width */}
            <main className="flex-1 ml-60 min-h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
