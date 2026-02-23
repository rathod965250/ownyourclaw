import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/actions/get-user";
import { getAgent, type Agent } from "@/actions/get-agent";
import { getUserSubscription } from "@/actions/get-user-subscription";
import { getEnabledIntegrations, type Integration } from "@/actions/get-integrations";
import { getUpcomingTasks, type ScheduledTask } from "@/actions/get-scheduled-tasks";
import { AgentStatusCard } from "@/components/dashboard/agent-status";
import {
    MessageSquare,
    CalendarClock,
    Plug,
    ArrowRight,
    Lightbulb,
} from "lucide-react";

// ─── Integration display map ─────────────────────────────────────────────────

const INTEGRATION_META: Record<string, { emoji: string; label: string }> = {
    gmail: { emoji: "📧", label: "Gmail" },
    google_calendar: { emoji: "📅", label: "Google Calendar" },
    google_drive: { emoji: "📁", label: "Google Drive" },
    notion: { emoji: "📝", label: "Notion" },
    todoist: { emoji: "✅", label: "Todoist" },
    airtable: { emoji: "📊", label: "Airtable" },
    github: { emoji: "💻", label: "GitHub" },
    linear: { emoji: "🔷", label: "Linear" },
    jira: { emoji: "🎯", label: "Jira" },
    vercel: { emoji: "▲", label: "Vercel" },
    stripe: { emoji: "💳", label: "Stripe" },
    shopify: { emoji: "🛍️", label: "Shopify" },
    hubspot: { emoji: "🟠", label: "HubSpot" },
    quickbooks: { emoji: "📗", label: "QuickBooks" },
    calendly: { emoji: "📆", label: "Calendly" },
    twitter: { emoji: "🐦", label: "Twitter / X" },
    youtube: { emoji: "🎬", label: "YouTube" },
    buffer: { emoji: "📣", label: "Buffer" },
    spotify: { emoji: "🎵", label: "Spotify" },
    strava: { emoji: "🏃", label: "Strava" },
};

const TOTAL_INTEGRATIONS = Object.keys(INTEGRATION_META).length;

// ─── Task icon map ───────────────────────────────────────────────────────────

function taskIcon(name: string) {
    const lower = name.toLowerCase();
    if (lower.includes("email") || lower.includes("mail")) return "📧";
    if (lower.includes("brief") || lower.includes("morning")) return "📅";
    if (lower.includes("report") || lower.includes("stripe")) return "📊";
    if (lower.includes("calendar")) return "📆";
    return "⚡";
}

// ─── Format next run ─────────────────────────────────────────────────────────

function formatNextRun(isoDate: string | null) {
    if (!isoDate) return "Not scheduled";
    const d = new Date(isoDate);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();

    if (diffMs < 0) return "Overdue";

    const diffH = Math.floor(diffMs / 3_600_000);
    if (diffH < 24) {
        return `Today ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    }
    if (diffH < 48) {
        return `Tomorrow ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    }
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardOverviewPage() {
    // ── Parallel data fetching from Supabase ─────────────────────────────────
    const [userRes, agentRes, subRes, integrationsRes, tasksRes] =
        await Promise.all([
            getUser(),
            getAgent(),
            getUserSubscription(),
            getEnabledIntegrations(),
            getUpcomingTasks(3),
        ]);

    if (!userRes.success) redirect("/login");

    const agent: Agent | null = agentRes.success ? agentRes.data : null;
    const integrations: Integration[] = integrationsRes.success ? integrationsRes.data : [];
    const tasks: ScheduledTask[] = tasksRes.success ? tasksRes.data : [];

    const agentName = agent?.agent_name ?? "Your Agent";
    const messageCount = agent?.message_count_today ?? 0;

    return (
        <div className="p-8 max-w-5xl mx-auto">

            {/* ── Page header ────────────────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-foreground tracking-tight">
                    Overview
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Welcome back — here's what's happening with{" "}
                    <span className="font-bold text-foreground">{agentName}</span>.
                </p>
            </div>

            {/* ── 1. Agent Status Card (realtime) ────────────────────────────────── */}
            <div className="mb-6">
                <AgentStatusCard initialAgent={agent} />
            </div>

            {/* ── 2. Stats Row ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Messages today */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            Messages today
                        </p>
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-foreground tracking-tight mb-1">
                        {messageCount}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        {messageCount > 0 ? "Keep it going 🔥" : "Send your first message!"}
                    </p>
                </div>

                {/* Tasks active */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            Tasks active
                        </p>
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                            <CalendarClock className="w-4 h-4 text-violet-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-foreground tracking-tight mb-1">
                        {tasks.length}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        {tasks.length > 0 && tasks[0].next_run_at
                            ? `Next: ${formatNextRun(tasks[0].next_run_at)}`
                            : "No scheduled tasks"}
                    </p>
                </div>

                {/* Integrations connected */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            Integrations
                        </p>
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                            <Plug className="w-4 h-4 text-emerald-500" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-foreground tracking-tight mb-1">
                        {integrations.length}{" "}
                        <span className="text-base font-medium text-muted-foreground">
                            / {TOTAL_INTEGRATIONS}
                        </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        {TOTAL_INTEGRATIONS - integrations.length} available to connect
                    </p>
                </div>
            </div>

            {/* ── 3. Connected Integrations ──────────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-foreground">
                        Connected Integrations
                    </h2>
                    <Link
                        href="/dashboard/integrations"
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                        Manage all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {integrations.length === 0 ? (
                    <Link
                        href="/dashboard/integrations"
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                        Connect your first integration →
                    </Link>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {integrations.map((integ) => {
                            const meta = INTEGRATION_META[integ.type] ?? {
                                emoji: "🔌",
                                label: integ.type,
                            };
                            return (
                                <div
                                    key={integ.id}
                                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:shadow-sm transition-all cursor-default"
                                >
                                    <span className="text-2xl">{meta.emoji}</span>
                                    <span className="text-[10px] font-bold text-foreground text-center leading-tight">
                                        {meta.label}
                                    </span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                                        Active
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── 4. Scheduled Tasks ─────────────────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-5 mb-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-black text-foreground">Scheduled Tasks</h2>
                    <Link
                        href="/dashboard/tasks"
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                        View all <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No scheduled tasks yet.{" "}
                        <Link
                            href="/dashboard/tasks"
                            className="text-primary font-medium hover:underline"
                        >
                            Create one →
                        </Link>
                    </p>
                ) : (
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors"
                            >
                                <span className="text-lg flex-shrink-0">
                                    {taskIcon(task.name)}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground truncate">
                                        {task.name}
                                    </p>
                                </div>
                                <span className="text-xs text-muted-foreground font-medium flex-shrink-0">
                                    {formatNextRun(task.next_run_at)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── 5. Quick Tip ───────────────────────────────────────────────────── */}
            <div className="flex items-start gap-3 px-5 py-4 rounded-xl border border-primary/20 bg-primary/[0.03]">
                <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">Tip:</span>{" "}
                    Try saying{" "}
                    <span className="font-mono text-primary font-semibold">
                        &quot;{agentName}, what&apos;s on my calendar today?&quot;
                    </span>{" "}
                    to get started.
                </p>
            </div>
        </div>
    );
}
