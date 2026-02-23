"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle,
    ChevronRight,
    Loader2,
    ArrowRight,
    X,
    MessageSquare,
    Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Channel = "whatsapp" | "telegram" | "slack";
type AgentName = "Andy" | "Max" | "Sage" | "Nova" | "Aria";

interface OnboardingState {
    channel: Channel | null;
    agentName: AgentName | null;
    telegramToken: string;
    whatsappConnected: boolean;
    telegramConnected: boolean;
    slackConnected: boolean;
    webSearchEnabled: boolean;
    gmailEnabled: boolean;
    notionEnabled: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STEP_LABELS = [
    "Payment",
    "Channel",
    "Connect",
    "Name",
    "Integrations",
    "You're live",
];

function StepBar({ current, total }: { current: number; total: number }) {
    const pct = Math.round(((current + 1) / total) * 100);
    return (
        <div className="mb-10">
            {/* Label row */}
            <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                    Step {current + 1} — {STEP_LABELS[current]}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
                    {pct}%
                </span>
            </div>
            {/* Segmented track */}
            <div className="flex items-center gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className="relative h-1.5 flex-1 rounded-full overflow-hidden bg-border"
                    >
                        <div
                            className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${i < current
                                ? "bg-primary"
                                : i === current
                                    ? "bg-primary/50"
                                    : "bg-transparent"
                                }`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function StepLabel({ step, label }: { step: number; label: string }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                Step {step} of 6
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {label}
            </span>
        </div>
    );
}

// ─── STEP 1 — Payment Confirmed ───────────────────────────────────────────────

function Step1({
    onNext,
    plan,
}: {
    onNext: () => void;
    plan: "starter" | "personal" | "teams";
}) {
    const [status, setStatus] = useState<"checking" | "confirmed">("checking");

    useEffect(() => {
        // Simulate a 2s payment check (real: poll subscriptions table)
        const timer = setTimeout(() => {
            setStatus("confirmed");
            const advance = setTimeout(onNext, 1200);
            return () => clearTimeout(advance);
        }, 2000);
        return () => clearTimeout(timer);
    }, [onNext]);

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            {status === "checking" ? (
                <>
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
                    <p className="text-lg font-bold text-foreground mb-2">Confirming your payment…</p>
                    <p className="text-sm text-muted-foreground">This only takes a moment</p>
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-xl font-black text-foreground mb-2">Payment confirmed!</p>
                    <p className="text-sm text-muted-foreground">
                        Setting up your <span className="text-primary font-bold capitalize">{plan}</span> agent…
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── STEP 2 — Pick Channel ────────────────────────────────────────────────────

const CHANNEL_OPTIONS: {
    id: Channel;
    emoji: string;
    label: string;
    sub: string;
    teamsOnly?: boolean;
}[] = [
        { id: "whatsapp", emoji: "📱", label: "WhatsApp", sub: "The world's most popular messaging app" },
        { id: "telegram", emoji: "✈️", label: "Telegram", sub: "Fast, private, and free" },
        { id: "slack", emoji: "💼", label: "Slack", sub: "For teams and work", teamsOnly: true },
    ];

function Step2({
    onNext,
    state,
    setState,
    plan,
}: {
    onNext: () => void;
    state: OnboardingState;
    setState: (s: Partial<OnboardingState>) => void;
    plan: "starter" | "personal" | "teams";
}) {
    return (
        <div>
            <StepLabel step={2} label="Choose your channel" />
            <h2 className="text-3xl font-black tracking-tight mb-2">
                How will you talk<br />
                <span className="italic text-primary">to your agent?</span>
            </h2>
            <p className="text-muted-foreground mb-10 text-sm">
                You can always add more channels later from your dashboard.
            </p>

            <div className="grid gap-3 mb-10">
                {CHANNEL_OPTIONS.map((ch) => {
                    const locked = ch.teamsOnly && plan !== "teams";
                    const selected = state.channel === ch.id;
                    return (
                        <button
                            key={ch.id}
                            onClick={() => !locked && setState({ channel: ch.id })}
                            className={`relative flex items-center gap-5 p-5 rounded-xl border-2 text-left transition-all duration-200 ${locked
                                ? "opacity-50 cursor-not-allowed border-border bg-muted/30"
                                : selected
                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                    : "border-border bg-card hover:border-primary/40 hover:shadow-md cursor-pointer"
                                }`}
                        >
                            <span className="text-3xl">{ch.emoji}</span>
                            <div className="flex-1">
                                <p className="font-extrabold text-foreground text-base">{ch.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{ch.sub}</p>
                            </div>
                            {locked && (
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border bg-muted px-2.5 py-1 rounded-full">
                                    Teams only
                                </span>
                            )}
                            {selected && !locked && (
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onNext}
                disabled={!state.channel}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
                Continue <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── STEP 3 — Channel Setup ───────────────────────────────────────────────────

function Step3WhatsApp({
    state,
    setState,
    onNext,
}: {
    state: OnboardingState;
    setState: (s: Partial<OnboardingState>) => void;
    onNext: () => void;
}) {
    const [clicked, setClicked] = useState(false);

    const handleConnect = () => {
        setClicked(true);
        // Week 1 mock: after 1.5s, simulate success
        setTimeout(() => setState({ whatsappConnected: true }), 1500);
    };

    return (
        <div>
            <StepLabel step={3} label="Connect WhatsApp" />
            <h2 className="text-3xl font-black tracking-tight mb-2">
                Link your<br />
                <span className="italic text-primary">WhatsApp number.</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-10">
                We use Meta's official WhatsApp Cloud API — fully compliant, zero ban risk.
            </p>

            {!state.whatsappConnected ? (
                <div className="space-y-6">
                    {/* Security callout */}
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 flex items-start gap-3">
                        <span className="text-green-500 text-lg mt-0.5">🔒</span>
                        <div>
                            <p className="text-sm font-bold text-foreground">Official Meta API</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Same infrastructure used by major banks and airlines. Your account is 100% TOS-compliant.
                            </p>
                        </div>
                    </div>

                    {/* WhatsApp button */}
                    <button
                        onClick={handleConnect}
                        disabled={clicked}
                        className="flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-white text-sm bg-[#25D366] hover:bg-[#20BA5A] active:scale-[0.98] transition-all shadow-lg shadow-[#25D366]/20 disabled:opacity-70"
                    >
                        {clicked ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        )}
                        {clicked ? "Connecting…" : "Continue with WhatsApp"}
                    </button>

                    <p className="text-[11px] text-muted-foreground">
                        A Facebook popup will appear. Log in, select your number, and grant permissions.
                    </p>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-5 rounded-xl bg-green-500/8 border border-green-500/25 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <p className="font-bold text-foreground">WhatsApp connected!</p>
                            <p className="text-xs text-muted-foreground">Your number is linked and ready.</p>
                        </div>
                    </div>
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        Continue <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

function Step3Telegram({
    state,
    setState,
    onNext,
}: {
    state: OnboardingState;
    setState: (s: Partial<OnboardingState>) => void;
    onNext: () => void;
}) {
    const [connecting, setConnecting] = useState(false);

    const handleConnect = () => {
        if (!state.telegramToken.trim()) return;
        setConnecting(true);
        setTimeout(() => {
            setState({ telegramConnected: true });
            setConnecting(false);
        }, 1500);
    };

    const steps = [
        { n: 1, text: "Open Telegram and search for", code: "@BotFather" },
        { n: 2, text: "Send the command", code: "/newbot" },
        { n: 3, text: "Choose a display name, e.g.", code: "My OwnClaw Bot" },
        { n: 4, text: "Choose a username ending in 'bot', e.g.", code: "myownclaw_bot" },
        { n: 5, text: "BotFather replies with your token — paste it below.", code: null },
    ];

    return (
        <div>
            <StepLabel step={3} label="Connect Telegram" />
            <h2 className="text-3xl font-black tracking-tight mb-2">
                Create your<br />
                <span className="italic text-primary">Telegram bot.</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
                Follow these steps in Telegram — takes about 30 seconds.
            </p>

            <div className="space-y-3 mb-8">
                {steps.map((s) => (
                    <div key={s.n} className="flex items-start gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[11px] font-black text-muted-foreground flex-shrink-0 mt-0.5">
                            {s.n}
                        </span>
                        <p className="text-muted-foreground leading-relaxed">
                            {s.text}{" "}
                            {s.code && (
                                <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-xs font-bold">
                                    {s.code}
                                </code>
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {!state.telegramConnected ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={state.telegramToken}
                        onChange={(e) => setState({ telegramToken: e.target.value })}
                        placeholder="Paste your bot token here…"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                        onClick={handleConnect}
                        disabled={!state.telegramToken.trim() || connecting}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: "#0088cc" }}
                    >
                        {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {connecting ? "Connecting…" : "Connect Telegram Bot"}
                    </button>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 rounded-xl bg-[#0088cc]/5 border border-[#0088cc]/20 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#0088cc]" />
                        <div>
                            <p className="font-bold text-foreground text-sm">Telegram bot connected!</p>
                            <p className="text-xs text-muted-foreground">Token verified and saved.</p>
                        </div>
                    </div>
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        Continue <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

function Step3Slack({
    state,
    setState,
    onNext,
}: {
    state: OnboardingState;
    setState: (s: Partial<OnboardingState>) => void;
    onNext: () => void;
}) {
    const [clicked, setClicked] = useState(false);

    const handleConnect = () => {
        setClicked(true);
        setTimeout(() => setState({ slackConnected: true }), 1500);
    };

    return (
        <div>
            <StepLabel step={3} label="Connect Slack" />
            <h2 className="text-3xl font-black tracking-tight mb-2">
                Add to your<br />
                <span className="italic text-primary">Slack workspace.</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-10">
                Click the button below to authorise ownyourclaw in your Slack workspace.
            </p>

            {!state.slackConnected ? (
                <div className="space-y-6">
                    <button
                        onClick={handleConnect}
                        disabled={clicked}
                        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-[#4A154B] hover:bg-[#611f69] text-white font-bold text-sm transition-all disabled:opacity-70 shadow-lg"
                    >
                        {clicked ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <svg viewBox="0 0 54 54" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0" />
                                <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D" />
                                <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E" />
                                <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.249m14.336 0v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.249a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A" />
                            </svg>
                        )}
                        {clicked ? "Connecting…" : "Add to Slack"}
                    </button>
                    <p className="text-[11px] text-muted-foreground">
                        You'll be redirected to Slack's authorisation page. Your workspace data stays private.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 rounded-xl bg-[#4A154B]/5 border border-[#4A154B]/20 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#4A154B]" />
                        <div>
                            <p className="font-bold text-foreground text-sm">Slack workspace connected!</p>
                            <p className="text-xs text-muted-foreground">Your agent can now post in Slack.</p>
                        </div>
                    </div>
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        Continue <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── STEP 4 — Name Your Agent ─────────────────────────────────────────────────

const AGENT_NAMES: AgentName[] = ["Andy", "Max", "Sage", "Nova", "Aria"];

function Step4({
    onNext,
    state,
    setState,
}: {
    onNext: () => void;
    state: OnboardingState;
    setState: (s: Partial<OnboardingState>) => void;
}) {
    return (
        <div>
            <StepLabel step={4} label="Name your agent" />
            <h2 className="text-3xl font-black tracking-tight mb-2">
                Give your agent<br />
                <span className="italic text-primary">a name.</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-10">
                This is how you'll activate it — just start your message with its name.
                <br />
                <span className="text-foreground font-semibold">e.g. "Andy, what's on my calendar today?"</span>
            </p>

            <div className="grid grid-cols-5 gap-3 mb-10">
                {AGENT_NAMES.map((name) => {
                    const selected = state.agentName === name;
                    return (
                        <button
                            key={name}
                            onClick={() => setState({ agentName: name })}
                            className={`py-5 rounded-xl border-2 font-extrabold text-base transition-all duration-200 ${selected
                                ? "border-primary bg-primary/5 text-primary shadow-md shadow-primary/10"
                                : "border-border bg-card text-foreground hover:border-primary/40 hover:shadow-md"
                                }`}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>

            {state.agentName && (
                <div className="mb-8 p-4 rounded-xl bg-muted/50 border border-border animate-in fade-in duration-300">
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">Preview</p>
                    <p className="text-sm font-mono text-foreground">
                        <span className="text-primary font-bold">{state.agentName}</span>, what's on my calendar today?
                    </p>
                </div>
            )}

            <button
                onClick={onNext}
                disabled={!state.agentName}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
                Continue <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── STEP 5 — Integrations ────────────────────────────────────────────────────

function ToggleSwitch({
    checked,
    onChange,
    disabled,
}: {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onChange}
            disabled={disabled}
            className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${checked ? "bg-primary" : "bg-border"
                } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

function Step5({
    onNext,
    state,
    setState,
}: {
    onNext: () => void;
    state: OnboardingState;
    setState: (s: Partial<OnboardingState>) => void;
}) {
    const integrations = [
        {
            emoji: "🌐",
            name: "Web Search",
            sub: "Your agent can search the internet",
            key: "webSearchEnabled" as const,
            alwaysOn: true,
        },
        {
            emoji: "📧",
            name: "Gmail",
            sub: "Read and send emails",
            key: "gmailEnabled" as const,
            alwaysOn: false,
        },
        {
            emoji: "📝",
            name: "Notion",
            sub: "Access your notes and databases",
            key: "notionEnabled" as const,
            alwaysOn: false,
        },
    ];

    return (
        <div>
            <StepLabel step={5} label="Enable integrations" />
            <h2 className="text-3xl font-black tracking-tight mb-2">
                Connect your<br />
                <span className="italic text-primary">favourite tools.</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-10">
                You can connect more from the dashboard at any time. This is optional.
            </p>

            <div className="space-y-3 mb-8">
                {integrations.map((item) => (
                    <div
                        key={item.key}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                    >
                        <span className="text-2xl w-9 h-9 flex items-center justify-center flex-shrink-0">
                            {item.emoji}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-bold text-sm text-foreground">{item.name}</p>
                                {item.alwaysOn && (
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
                                        Always on
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {!item.alwaysOn && state[item.key] && (
                                <button className="text-xs font-bold text-primary border border-primary/30 bg-primary/5 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors">
                                    Connect
                                </button>
                            )}
                            <ToggleSwitch
                                checked={state[item.key]}
                                onChange={() => !item.alwaysOn && setState({ [item.key]: !state[item.key] })}
                                disabled={item.alwaysOn}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                    Continue <ArrowRight className="w-4 h-4" />
                </button>
                <button
                    onClick={onNext}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    Skip for now →
                </button>
            </div>
        </div>
    );
}

// ─── STEP 6 — You're Live ─────────────────────────────────────────────────────

function Step6({ agentName, channel }: { agentName: AgentName; channel: Channel }) {
    const channelLabel = channel === "whatsapp" ? "WhatsApp" : channel === "telegram" ? "Telegram" : "Slack";

    return (
        <div className="text-center">
            <div className="mb-8 animate-in fade-in zoom-in-95 duration-700">
                <p className="text-6xl mb-6">🎉</p>
                <h2 className="text-4xl font-black tracking-tight mb-3">
                    {agentName} is ready!
                </h2>
                <p className="text-muted-foreground text-base mb-10">
                    Message <span className="font-bold text-foreground">{agentName}</span> on{" "}
                    <span className="font-bold text-foreground">{channelLabel}</span> to get started.
                </p>
            </div>

            {/* Example message */}
            <div className="mb-10 p-5 rounded-2xl border border-border bg-card text-left max-w-md mx-auto shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">
                    Try this first message
                </p>
                <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="bg-muted rounded-xl rounded-tl-sm px-4 py-3 inline-block">
                            <p className="text-sm text-foreground font-mono">
                                <span className="text-primary font-bold">{agentName}</span>, what's on my calendar today?
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trigger word reminder */}
            <div className="mb-10 p-4 rounded-xl bg-primary/5 border border-primary/20 max-w-md mx-auto">
                <p className="text-xs text-muted-foreground mb-1">Your trigger word</p>
                <p className="text-2xl font-black text-primary">{agentName}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Start every message with this to activate your agent
                </p>
            </div>

            <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
            >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="mt-5 text-xs text-muted-foreground">
                You can change your name, channel, and integrations anytime from Settings.
            </p>
        </div>
    );
}

// ─── Main Onboarding Component ────────────────────────────────────────────────

export default function OnboardingWizard({ plan }: { plan: "starter" | "personal" | "teams" }) {
    const router = useRouter();

    const [step, setStep] = useState(0); // 0-5 = steps 1-6
    const confettiRef = useRef<HTMLCanvasElement>(null);

    const [state, setStateFull] = useState<OnboardingState>({
        channel: null,
        agentName: null,
        telegramToken: "",
        whatsappConnected: false,
        telegramConnected: false,
        slackConnected: false,
        webSearchEnabled: true,
        gmailEnabled: false,
        notionEnabled: false,
    });

    const setState = (partial: Partial<OnboardingState>) =>
        setStateFull((prev) => ({ ...prev, ...partial }));

    const next = () => setStep((s) => Math.min(s + 1, 5));

    // Confetti on step 6
    useEffect(() => {
        if (step === 5) {
            import("canvas-confetti").then(({ default: confetti }) => {
                confetti({
                    particleCount: 160,
                    spread: 80,
                    origin: { y: 0.5 },
                    colors: ["#a855f7", "#6366f1", "#ec4899", "#f59e0b"],
                });
            });
        }
    }, [step]);

    const TOTAL_STEPS = 6;

    const renderStep = () => {
        switch (step) {
            case 0:
                return <Step1 onNext={next} plan={plan} />;
            case 1:
                return <Step2 onNext={next} state={state} setState={setState} plan={plan} />;
            case 2:
                if (state.channel === "whatsapp")
                    return <Step3WhatsApp state={state} setState={setState} onNext={next} />;
                if (state.channel === "telegram")
                    return <Step3Telegram state={state} setState={setState} onNext={next} />;
                if (state.channel === "slack")
                    return <Step3Slack state={state} setState={setState} onNext={next} />;
                // Fallback if no channel chosen (shouldn't happen)
                return <Step2 onNext={next} state={state} setState={setState} plan={plan} />;
            case 3:
                return <Step4 onNext={next} state={state} setState={setState} />;
            case 4:
                return <Step5 onNext={next} state={state} setState={setState} />;
            case 5:
                return (
                    <Step6
                        agentName={state.agentName ?? "Andy"}
                        channel={state.channel ?? "whatsapp"}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Top bar */}
            <header className="w-full px-6 py-5 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                        <Zap className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
                    </div>
                    <span className="font-black text-base tracking-tight">ownyourclaw</span>
                </div>

                {/* Step indicator dots */}
                <div className="hidden sm:flex items-center gap-1.5">
                    {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-300 ${i < step
                                ? "w-4 h-2 bg-primary"
                                : i === step
                                    ? "w-4 h-2 bg-primary/50"
                                    : "w-2 h-2 bg-border"
                                }`}
                        />
                    ))}
                </div>

                <Link
                    href="/dashboard"
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                    Skip setup <X className="w-3 h-3" />
                </Link>
            </header>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg">
                    {/* Progress bar — always visible on all 6 steps */}
                    <StepBar current={step} total={TOTAL_STEPS} />

                    {/* Step content */}
                    <div
                        key={step}
                        className="animate-in fade-in slide-in-from-right-6 duration-400"
                    >
                        {renderStep()}
                    </div>
                </div>
            </main>
        </div>
    );
}
