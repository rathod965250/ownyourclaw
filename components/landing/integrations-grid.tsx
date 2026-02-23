"use client";

import { useState } from "react";

const integrations = [
    { favicon: "gmail.com", name: "Gmail", emoji: "📧" },
    { favicon: "calendar.google.com", name: "Google Calendar", emoji: "📅" },
    { favicon: "notion.so", name: "Notion", emoji: "📝" },
    { favicon: "github.com", name: "GitHub", emoji: "🐙" },
    { favicon: "stripe.com", name: "Stripe", emoji: "💳" },
    { favicon: "shopify.com", name: "Shopify", emoji: "🛒" },
    { favicon: "todoist.com", name: "Todoist", emoji: "✅" },
    { favicon: "linear.app", name: "Linear", emoji: "🔵" },
    { favicon: "pagerduty.com", name: "PagerDuty", emoji: "🚨" },
    { favicon: "vercel.com", name: "Vercel", emoji: "▲" },
    { favicon: "calendly.com", name: "Calendly", emoji: "📆" },
    { favicon: "airtable.com", name: "Airtable", emoji: "🗂️" },
    { favicon: "x.com", name: "Twitter / X", emoji: "🐦" },
    { favicon: "youtube.com", name: "YouTube", emoji: "📺" },
    { favicon: "weather.com", name: "Weather", emoji: "🌤️" },
    { favicon: "news.google.com", name: "News", emoji: "📰" },
    { favicon: "google.com", name: "Web Search", emoji: "🌐" },
    { favicon: "anthropic.com", name: "Agent Swarms", emoji: "🤖" },
];

function IntegrationTile({ favicon, name, emoji }: { favicon: string; name: string; emoji: string }) {
    const [imgFailed, setImgFailed] = useState(false);

    return (
        <div className="group flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-default aspect-square">
            <div className="w-9 h-9 flex items-center justify-center">
                {imgFailed ? (
                    <span className="text-2xl" aria-hidden="true">{emoji}</span>
                ) : (
                    <img
                        src={`https://www.google.com/s2/favicons?domain=${favicon}&sz=64`}
                        alt={name}
                        width={36}
                        height={36}
                        className="w-8 h-8 object-contain rounded-md group-hover:scale-110 transition-transform duration-300"
                        onError={() => setImgFailed(true)}
                    />
                )}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                {name}
            </span>
        </div>
    );
}

export function IntegrationsGrid() {
    return (
        <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-10">
                {integrations.map((item, i) => (
                    <IntegrationTile key={i} {...item} />
                ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
                <span className="text-foreground font-bold">...and 10+ more.</span>{" "}
                New integrations added every month.
            </p>
        </>
    );
}
