/**
 * /onboarding — Server Component route guard
 *
 * Checks (in order):
 *  1. Is the user logged in?        → /login
 *  2. Do they have an active sub?   → /#pricing
 *  3. Is onboarding already done?   → /dashboard
 *
 * If all checks pass, renders the client-side wizard.
 */

import { redirect } from "next/navigation";
import { getUser } from "@/actions/get-user";
import { getUserSubscription } from "@/actions/get-user-subscription";
import { getAgent } from "@/actions/get-agent";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage({
    searchParams,
}: {
    searchParams: Promise<{ plan?: string }>;
}) {
    // ── 1. Auth check ────────────────────────────────────────────────────────────
    const userRes = await getUser();
    if (!userRes.success) {
        redirect("/login");
    }

    // ── 2. Active subscription check ─────────────────────────────────────────────
    const subRes = await getUserSubscription();
    const hasActiveSub =
        subRes.success &&
        subRes.data.subscription !== null &&
        subRes.data.subscription.status === "active";

    if (!hasActiveSub) {
        redirect("/#pricing");
    }

    // ── 3. Agent already set up? ─────────────────────────────────────────────────
    const agentRes = await getAgent();
    const agentComplete =
        agentRes.success &&
        agentRes.data !== null &&
        agentRes.data.onboarding_complete === true;

    if (agentComplete) {
        redirect("/dashboard");
    }

    // ── All checks passed → show the wizard ──────────────────────────────────────
    const resolvedParams = await searchParams;
    const plan = (resolvedParams.plan as "starter" | "personal" | "teams") ?? "personal";

    return <OnboardingWizard plan={plan} />;
}
