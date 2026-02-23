"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Lock, ArrowUpRight } from "lucide-react";

// ─── Integration definitions ────────────────────────────────────────────────

type Plan = "starter" | "personal" | "teams";

interface IntegrationDef {
    type: string;
    emoji: string;
    label: string;
    description: string;
    category: string;
    /** Which plans can use this integration */
    requiredPlan: Plan;
    /** Is the OAuth route implemented? */
    oauthReady: boolean;
    /** Auto-connected when parent is connected (e.g. google_calendar ← gmail) */
    bundledWith?: string;
    /** Warning shown in disconnect confirmation */
    disconnectWarning: string;
}

const INTEGRATIONS: IntegrationDef[] = [
    // ── Communication ──────────────────────────────────────────────────────────
    {
        type: "gmail",
        emoji: "📧",
        label: "Gmail",
        description: "Read and send emails",
        category: "Communication",
        requiredPlan: "starter",
        oauthReady: true,
        disconnectWarning: "Your agent won't be able to read or send emails.",
    },
    {
        type: "google_calendar",
        emoji: "📅",
        label: "Google Calendar",
        description: "Read your calendar events",
        category: "Communication",
        requiredPlan: "starter",
        oauthReady: true,
        bundledWith: "gmail",
        disconnectWarning: "Your agent won't have access to your calendar.",
    },

    // ── Productivity ───────────────────────────────────────────────────────────
    {
        type: "notion",
        emoji: "📝",
        label: "Notion",
        description: "Access notes and databases",
        category: "Productivity",
        requiredPlan: "personal",
        oauthReady: true,
        disconnectWarning: "Your agent won't be able to access your Notion workspace.",
    },
    {
        type: "todoist",
        emoji: "✅",
        label: "Todoist",
        description: "Manage your tasks",
        category: "Productivity",
        requiredPlan: "personal",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to manage your tasks.",
    },
    {
        type: "calendly",
        emoji: "📆",
        label: "Calendly",
        description: "Manage scheduling links",
        category: "Productivity",
        requiredPlan: "personal",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to manage scheduling.",
    },
    {
        type: "google_drive",
        emoji: "📁",
        label: "Google Drive",
        description: "Read files and documents",
        category: "Productivity",
        requiredPlan: "starter",
        oauthReady: true,
        bundledWith: "gmail",
        disconnectWarning: "Your agent won't be able to access your Drive files.",
    },

    // ── Developer ──────────────────────────────────────────────────────────────
    {
        type: "github",
        emoji: "💻",
        label: "GitHub",
        description: "Access repos and issues",
        category: "Developer",
        requiredPlan: "personal",
        oauthReady: true,
        disconnectWarning: "Your agent won't have access to your repositories.",
    },
    {
        type: "linear",
        emoji: "🔷",
        label: "Linear",
        description: "Track issues and projects",
        category: "Developer",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to track Linear issues.",
    },
    {
        type: "vercel",
        emoji: "▲",
        label: "Vercel",
        description: "Manage deployments",
        category: "Developer",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to manage deployments.",
    },
    {
        type: "jira",
        emoji: "🎯",
        label: "Jira",
        description: "Track team issues",
        category: "Developer",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't have access to Jira.",
    },

    // ── Marketing ──────────────────────────────────────────────────────────────
    {
        type: "twitter",
        emoji: "🐦",
        label: "Twitter / X",
        description: "Post and monitor tweets",
        category: "Marketing",
        requiredPlan: "personal",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to post or monitor tweets.",
    },
    {
        type: "buffer",
        emoji: "📣",
        label: "Buffer",
        description: "Schedule social posts",
        category: "Marketing",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to schedule posts.",
    },
    {
        type: "hubspot",
        emoji: "🟠",
        label: "HubSpot",
        description: "CRM and marketing tools",
        category: "Marketing",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't have access to HubSpot.",
    },

    // ── Business ───────────────────────────────────────────────────────────────
    {
        type: "stripe",
        emoji: "💳",
        label: "Stripe",
        description: "Revenue and payments",
        category: "Business",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to access payment data.",
    },
    {
        type: "shopify",
        emoji: "🛍️",
        label: "Shopify",
        description: "Store and order data",
        category: "Business",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't have access to your store.",
    },
    {
        type: "quickbooks",
        emoji: "📗",
        label: "QuickBooks",
        description: "Accounting and invoicing",
        category: "Business",
        requiredPlan: "teams",
        oauthReady: false,
        disconnectWarning: "Your agent won't be able to access accounting data.",
    },
];

// Plan hierarchy: starter < personal < teams
const PLAN_RANK: Record<Plan, number> = {
    starter: 0,
    personal: 1,
    teams: 2,
};

const PLAN_LABELS: Record<Plan, string> = {
    starter: "Starter",
    personal: "Personal",
    teams: "Teams",
};

// Group integrations by category (preserving order)
const CATEGORIES = Array.from(
    new Set(INTEGRATIONS.map((i) => i.category))
);

// ─── Disconnect Confirmation Modal ──────────────────────────────────────────

interface ConfirmModalProps {
    label: string;
    warning: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
}

function DisconnectModal({
    label,
    warning,
    onConfirm,
    onCancel,
    loading,
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />
            {/* Dialog */}
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-base font-black text-foreground mb-2">
                    Disconnect {label}?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">{warning}</p>
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg border border-border hover:bg-muted/60 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {loading ? "Disconnecting…" : "Disconnect"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Integration Card ───────────────────────────────────────────────────────

interface CardProps {
    integ: IntegrationDef;
    connected: boolean;
    planLocked: boolean;
    requiredPlanLabel: string;
    bundledParentConnected: boolean;
    onConnect: () => void;
    onDisconnect: () => void;
}

function IntegrationCard({
    integ,
    connected,
    planLocked,
    requiredPlanLabel,
    bundledParentConnected,
    onConnect,
    onDisconnect,
}: CardProps) {
    const comingSoon = !integ.oauthReady && !connected && !planLocked;

    return (
        <div
            className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all min-h-[170px] ${connected
                    ? "border-emerald-200 bg-emerald-50/30 dark:bg-emerald-950/10"
                    : planLocked
                        ? "border-border bg-muted/30 opacity-75"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                }`}
        >
            {/* Header */}
            <div>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{integ.emoji}</span>
                        <span className="text-sm font-bold text-foreground">
                            {integ.label}
                        </span>
                    </div>

                    {/* Status badge */}
                    {connected ? (
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                            ✅ Connected
                        </span>
                    ) : planLocked ? (
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
                            <Lock className="w-2.5 h-2.5" /> {requiredPlanLabel}
                        </span>
                    ) : null}
                </div>

                <p className="text-xs text-muted-foreground mb-1">{integ.description}</p>
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                    {integ.category}
                </p>
            </div>

            {/* Action button */}
            <div className="mt-4 flex justify-end">
                {connected ? (
                    <button
                        onClick={onDisconnect}
                        className="px-3.5 py-2 text-[11px] font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20 transition-all"
                    >
                        Disconnect
                    </button>
                ) : planLocked ? (
                    <Link
                        href="/#pricing"
                        className="px-3.5 py-2 text-[11px] font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-all flex items-center gap-1.5"
                    >
                        Upgrade Plan <ArrowUpRight className="w-3 h-3" />
                    </Link>
                ) : integ.bundledWith && !bundledParentConnected ? (
                    <span className="text-[11px] font-medium text-muted-foreground/60 italic">
                        Connect {INTEGRATIONS.find((i) => i.type === integ.bundledWith)?.label ?? integ.bundledWith} first
                    </span>
                ) : comingSoon ? (
                    <span className="text-[11px] font-medium text-muted-foreground/50">
                        Coming soon
                    </span>
                ) : (
                    <button
                        onClick={onConnect}
                        className="px-3.5 py-2 text-[11px] font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                    >
                        Connect
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── Main Grid Component ────────────────────────────────────────────────────

interface Props {
    plan: Plan;
    connectedTypes: string[];
}

export function IntegrationsGrid({ plan, connectedTypes }: Props) {
    const router = useRouter();
    const [disconnecting, setDisconnecting] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<IntegrationDef | null>(null);

    const isConnected = useCallback(
        (type: string) => connectedTypes.includes(type),
        [connectedTypes]
    );

    const isPlanLocked = useCallback(
        (requiredPlan: Plan) => PLAN_RANK[plan] < PLAN_RANK[requiredPlan],
        [plan]
    );

    const handleConnect = (type: string) => {
        window.location.href = `/api/integrations/connect?provider=${type}`;
    };

    const handleDisconnectClick = (integ: IntegrationDef) => {
        setConfirmModal(integ);
    };

    const handleDisconnectConfirm = async () => {
        if (!confirmModal) return;
        setDisconnecting(confirmModal.type);

        try {
            const res = await fetch("/api/integrations/disconnect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ provider: confirmModal.type }),
            });

            if (res.ok) {
                // TODO Week 2: POST /api/containers/{userId}/reload
                router.refresh();
            }
        } finally {
            setDisconnecting(null);
            setConfirmModal(null);
        }
    };

    return (
        <>
            {/* Disconnect confirmation modal */}
            {confirmModal && (
                <DisconnectModal
                    label={confirmModal.label}
                    warning={confirmModal.disconnectWarning}
                    onConfirm={handleDisconnectConfirm}
                    onCancel={() => setConfirmModal(null)}
                    loading={disconnecting === confirmModal.type}
                />
            )}

            {/* Category sections */}
            <div className="space-y-10">
                {CATEGORIES.map((category) => {
                    const items = INTEGRATIONS.filter((i) => i.category === category);
                    return (
                        <div key={category}>
                            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">
                                {category}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((integ) => (
                                    <IntegrationCard
                                        key={integ.type}
                                        integ={integ}
                                        connected={isConnected(integ.type)}
                                        planLocked={isPlanLocked(integ.requiredPlan)}
                                        requiredPlanLabel={PLAN_LABELS[integ.requiredPlan]}
                                        bundledParentConnected={
                                            integ.bundledWith
                                                ? isConnected(integ.bundledWith)
                                                : false
                                        }
                                        onConnect={() => handleConnect(integ.type)}
                                        onDisconnect={() => handleDisconnectClick(integ)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
