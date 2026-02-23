"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Agent } from "@/actions/get-agent";

type AgentStatus = "online" | "offline" | "provisioning";

function deriveStatus(agent: Agent | null): AgentStatus {
    if (!agent) return "offline";
    switch (agent.status) {
        case "active":
            return "online";
        case "provisioning":
        case "pending":
            return "provisioning";
        case "stopped":
        case "error":
        default:
            return agent.onboarding_complete ? "online" : "offline";
    }
}

function statusLabel(s: AgentStatus) {
    return s === "online" ? "ONLINE" : s === "offline" ? "OFFLINE" : "PROVISIONING";
}

function StatusDot({ status }: { status: AgentStatus }) {
    const styles: Record<AgentStatus, string> = {
        online: "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.4)]",
        offline: "bg-red-500   shadow-[0_0_8px_2px_rgba(239,68,68,0.3)]",
        provisioning: "bg-amber-400 shadow-[0_0_8px_2px_rgba(251,191,36,0.35)]",
    };
    const animate: Record<AgentStatus, string> = {
        online: "animate-pulse",
        offline: "",
        provisioning: "animate-pulse",
    };
    return (
        <span
            className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${styles[status]} ${animate[status]}`}
        />
    );
}

// ─── Exported Component ───────────────────────────────────────────────────────

interface AgentStatusBadgeProps {
    /** Server-rendered initial agent data */
    initialAgent: Agent | null;
}

/**
 * Renders the live status dot + label.
 * Subscribes to `agents` Postgres changes to update the dot in real time.
 */
export function AgentStatusBadge({ initialAgent }: AgentStatusBadgeProps) {
    const [agent, setAgent] = useState<Agent | null>(initialAgent);
    const agentStatus = deriveStatus(agent);

    useEffect(() => {
        if (!initialAgent?.user_id) return;

        const supabase = createClient();

        const channel = supabase
            .channel("agent-status")
            .on(
                "postgres_changes",
                {
                    event: "*", // INSERT, UPDATE, DELETE
                    schema: "public",
                    table: "agents",
                    filter: `user_id=eq.${initialAgent.user_id}`,
                },
                (payload) => {
                    if (payload.eventType === "DELETE") {
                        setAgent(null);
                    } else {
                        setAgent(payload.new as Agent);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [initialAgent?.user_id]);

    return (
        <div className="flex items-center gap-2">
            <StatusDot status={agentStatus} />
            <span
                className={`text-[10px] font-black uppercase tracking-[0.15em] ${agentStatus === "online"
                        ? "text-green-600"
                        : agentStatus === "offline"
                            ? "text-red-500"
                            : "text-amber-500"
                    }`}
            >
                {statusLabel(agentStatus)}
            </span>
        </div>
    );
}

/**
 * Full agent status card header — used on the overview page.
 * Includes realtime status updates.
 */
export function AgentStatusCard({
    initialAgent,
}: {
    initialAgent: Agent | null;
}) {
    const [agent, setAgent] = useState<Agent | null>(initialAgent);
    const agentStatus = deriveStatus(agent);

    const agentName = agent?.agent_name ?? "Your Agent";
    const channelName =
        agent?.channel === "telegram"
            ? "Telegram"
            : agent?.channel === "slack"
                ? "Slack"
                : "WhatsApp";

    // Format last_message_at
    const lastMsg = agent?.last_message_at
        ? formatRelative(agent.last_message_at)
        : "No messages yet";

    // Realtime subscription
    useEffect(() => {
        if (!initialAgent?.user_id) return;

        const supabase = createClient();

        const channel = supabase
            .channel("agent-status-card")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "agents",
                    filter: `user_id=eq.${initialAgent.user_id}`,
                },
                (payload) => {
                    if (payload.eventType === "DELETE") {
                        setAgent(null);
                    } else {
                        setAgent(payload.new as Agent);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [initialAgent?.user_id]);

    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <StatusDot status={agentStatus} />
                            <span
                                className={`text-[10px] font-black uppercase tracking-[0.15em] ${agentStatus === "online"
                                        ? "text-green-600"
                                        : agentStatus === "offline"
                                            ? "text-red-500"
                                            : "text-amber-500"
                                    }`}
                            >
                                {statusLabel(agentStatus)}
                            </span>
                            <span className="text-muted-foreground/30">·</span>
                            <span className="text-sm font-black text-foreground">{agentName}</span>
                            <span className="text-muted-foreground/30">·</span>
                            <span className="text-sm font-medium text-muted-foreground">{channelName}</span>
                            {agent?.whatsapp_phone_number_id && (
                                <>
                                    <span className="text-muted-foreground/30">·</span>
                                    <span className="text-sm text-muted-foreground font-mono">
                                        +91 98765…
                                    </span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                            {agentStatus === "online"
                                ? "Agent is active and ready for messages."
                                : agentStatus === "provisioning"
                                    ? "Agent is setting up — this takes about 60 seconds."
                                    : "Agent is offline. Restart to reconnect."}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Last message:{" "}
                            <span className="text-muted-foreground font-medium">{lastMsg}</span>
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted/60 text-xs font-bold text-muted-foreground transition-all hover:text-foreground">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" /></svg>
                        Restart
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted/60 text-xs font-bold text-muted-foreground transition-all hover:text-foreground">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatRelative(isoDate: string): string {
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60_000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffH = Math.floor(diffMins / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
}
