"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Plug,
    CalendarClock,
    Settings,
    LogOut,
    Zap,
    ArrowUpRight,
    ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/integrations", label: "Integrations", icon: Plug },
    { href: "/dashboard/tasks", label: "Scheduled Tasks", icon: CalendarClock },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface SidebarProps {
    plan: "starter" | "personal" | "teams";
    agentName?: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({ plan, agentName }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const planLabel: Record<string, string> = {
        starter: "STARTER",
        personal: "PERSONAL",
        teams: "TEAMS",
    };

    const planColor: Record<string, string> = {
        starter: "text-amber-600  bg-amber-50  border-amber-200",
        personal: "text-primary    bg-primary/5 border-primary/20",
        teams: "text-violet-600 bg-violet-50 border-violet-200",
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-60 flex flex-col border-r border-border bg-card">

            {/* ── Logo ── */}
            <div className="px-5 py-5 flex items-center gap-2.5 border-b border-border">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/20 flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
                </div>
                <span className="font-black text-sm tracking-tight text-foreground">ownyourclaw</span>
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active =
                        href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(href);

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150",
                                active
                                    ? "bg-primary/8 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            )}
                        >
                            <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-primary" : "")} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Bottom section ── */}
            <div className="px-3 pb-4 pt-3 border-t border-border flex flex-col gap-3">

                {/* Plan badge */}
                <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium">Current plan</span>
                    <span
                        className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                            planColor[plan] ?? planColor.personal
                        )}
                    >
                        {planLabel[plan]}
                    </span>
                </div>

                {/* Upgrade button (only for starter) */}
                {plan === "starter" && (
                    <Link
                        href="/#pricing"
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group"
                    >
                        <span className="text-xs font-bold text-primary">Upgrade plan</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                )}

                {/* Sign out */}
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all w-full text-left"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}
