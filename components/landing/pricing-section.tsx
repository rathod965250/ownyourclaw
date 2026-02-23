import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { PricingProduct } from "@/actions/get-dodo-products";

// ─── Plan metadata (features, badge, channel, etc.) ─────────────────────────
// These are keyed by product name (lowercased) or metadata.plan_key.

interface PlanMeta {
    badge?: string;
    featured?: boolean;
    channel: string;
    channelEmoji: string;
    priceLabel?: string;
    features: string[];
}

const PLAN_META: Record<string, PlanMeta> = {
    starter: {
        channel: "WhatsApp or Telegram",
        channelEmoji: "📱",
        features: [
            "500 messages / month",
            "🌐  Web Search",
            "🌤️  Weather",
            "📰  News",
        ],
    },
    personal: {
        badge: "⭐ Most Popular",
        featured: true,
        channel: "WhatsApp or Telegram",
        channelEmoji: "📱",
        features: [
            "Unlimited messages",
            "📧  Gmail",
            "📅  Google Calendar",
            "📝  Notion",
            "✅  Todoist",
            "🐙  GitHub",
        ],
    },
    teams: {
        channel: "Slack + WhatsApp / Telegram",
        channelEmoji: "💬",
        priceLabel: "/mo per workspace",
        features: [
            "Unlimited + Agent Swarms 🤖",
            "🏢  HubSpot",
            "📋  Jira",
            "💳  Stripe",
            "🛒  Shopify",
            "🔵  Linear",
            "▲  Vercel",
            "+ All Personal integrations",
        ],
    },
};

/**
 * Tries to match a Dodo product to our plan metadata.
 * Checks in order: metadata.plan_key → product name (lowercase contains).
 */
function getPlanMeta(product: PricingProduct): PlanMeta {
    // 1. Check metadata.plan_key if set in Dodo dashboard
    const planKey = product.metadata?.plan_key?.toLowerCase();
    if (planKey && PLAN_META[planKey]) return PLAN_META[planKey];

    // 2. Match by product name
    const name = product.name.toLowerCase();
    if (name.includes("team")) return PLAN_META.teams;
    if (name.includes("personal")) return PLAN_META.personal;
    if (name.includes("starter")) return PLAN_META.starter;

    // 3. Fallback
    return PLAN_META.starter;
}

function formatPrice(amount: number): string {
    // Show as integer if whole number, otherwise 2 decimal places
    return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`;
}

function formatInterval(interval: string | null): string {
    if (!interval) return "";
    switch (interval) {
        case "month":
            return "/mo";
        case "year":
            return "/yr";
        case "day":
            return "/day";
        case "week":
            return "/wk";
        default:
            return `/${interval}`;
    }
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
    products: PricingProduct[];
}

export function PricingSection({ products }: Props) {
    if (!products.length) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>Pricing information is loading…</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {products.map((product) => {
                const meta = getPlanMeta(product);
                const isFeatured = meta.featured === true;
                const priceLabel =
                    meta.priceLabel ?? formatInterval(product.interval);

                return (
                    <div
                        key={product.productId}
                        className={`relative p-8 rounded-2xl flex flex-col transition-all duration-300 ${isFeatured
                                ? "border-2 border-primary bg-background shadow-2xl shadow-primary/10 md:-translate-y-4"
                                : "border border-border bg-card hover:shadow-lg"
                            }`}
                    >
                        {/* Most Popular badge */}
                        {meta.badge && (
                            <div className="absolute -top-[17px] left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap shadow-md shadow-primary/30">
                                {meta.badge}
                            </div>
                        )}

                        {/* Plan name */}
                        <p
                            className={`text-xs font-black uppercase tracking-widest mb-5 ${isFeatured ? "text-primary" : "text-muted-foreground"
                                }`}
                        >
                            {product.name}
                        </p>

                        {/* Price — pulled from Dodo */}
                        <div className="mb-1">
                            <span
                                className={`font-black tracking-tighter text-foreground ${isFeatured ? "text-6xl" : "text-5xl"
                                    }`}
                            >
                                {formatPrice(product.priceAmount)}
                            </span>
                            <span className="text-muted-foreground text-sm ml-1">
                                {priceLabel}
                            </span>
                        </div>

                        <div className="h-px bg-border my-6" />

                        {/* Channel pill */}
                        <div
                            className={`flex items-center gap-2 mb-6 px-3 py-2.5 rounded-lg border ${isFeatured
                                    ? "bg-primary/8 border-primary/25"
                                    : "bg-muted/70 border-border/60"
                                }`}
                        >
                            <span className="text-sm">{meta.channelEmoji}</span>
                            <span
                                className={`text-[11px] font-bold ${isFeatured ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {meta.channel}
                            </span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3.5 flex-grow mb-8">
                            {meta.features.map((f, i) => (
                                <li
                                    key={i}
                                    className={`flex items-center gap-3 text-sm ${isFeatured
                                            ? "text-foreground font-semibold"
                                            : "text-muted-foreground"
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* CTA — links to checkout with product_id */}
                        <Link
                            href={`/checkout?product_id=${product.productId}`}
                            className={`block w-full py-3.5 text-center rounded-xl font-bold text-sm transition-all ${isFeatured
                                    ? "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20"
                                    : "border border-border hover:bg-muted"
                                }`}
                        >
                            Get Started
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
