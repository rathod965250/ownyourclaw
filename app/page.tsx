import { getUser } from "@/actions/get-user";
import { getDodoProducts } from "@/actions/get-dodo-products";
import Link from "next/link";
import {
  CheckCircle,
  Zap,
  MessageSquare,
  QrCode,
  ArrowRight,
  Mail,
  Github,
  Database,
  Chrome,
  Slack,
  Twitter,
  Instagram,
  Globe,
  Lock,
  Cpu,
  ShieldCheck,
  Cloud,
  Layers,
  MousePointer2,
  Calendar,
  Layout,
  Terminal,
  Code2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { IntegrationsGrid } from "@/components/landing/integrations-grid";
import { PricingSection } from "@/components/landing/pricing-section";

export default async function Home() {
  const [userRes, products] = await Promise.all([
    getUser(),
    getDodoProducts(),
  ]);
  const user = userRes.success ? userRes.data : null;

  // Use cheapest product price for hero CTA
  const cheapestPrice = products.length > 0 ? products[0].priceAmount : 12;

  const SITE_URL = "https://ownyourclaw.com";

  return (
    <>
      {/* ── JSON-LD Structured Data for AI SEO + Google Rich Results ── */}

      {/* SoftwareApplication schema — tells AI & Google what this product IS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ownyourclaw",
            "url": SITE_URL,
            "description": "ownyourclaw is an AI agent that lives in your WhatsApp. Powered by Claude 3.5 Sonnet and connected to Gmail, Notion, GitHub, Stripe, Shopify and 20+ more tools. Setup takes 60 seconds. No technical skills required.",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "WhatsApp, Telegram, Slack",
            "offers": products.map(p => ({
              "@type": "Offer",
              "name": p.name,
              "price": String(p.priceAmount),
              "priceCurrency": p.currency,
              "priceSpecification": { "@type": "UnitPriceSpecification", "billingDuration": "P1M" },
              "description": p.description ?? `${p.name} plan`
            })),
            "featureList": [
              "WhatsApp AI agent powered by Claude 3.5 Sonnet",
              "Gmail integration — read, reply, archive",
              "Google Calendar integration — create, reschedule, cancel events",
              "Notion integration — update pages, databases, tasks",
              "GitHub integration — query issues, PRs, CI status",
              "Stripe integration — monitor payments and payouts",
              "Shopify integration",
              "Todoist integration",
              "Linear integration",
              "Vercel integration",
              "Web Search, Weather, News",
              "Agent Swarms for Teams",
              "60-second setup, no technical skills required",
              "Confirmation required for all write actions",
              "End-to-end encrypted credentials"
            ],
            "screenshot": `${SITE_URL}/og-image.png`,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "38"
            }
          })
        }}
      />

      {/* Organization schema — establishes brand entity for knowledge graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ownyourclaw",
            "url": SITE_URL,
            "logo": `${SITE_URL}/logo.png`,
            "description": "ownyourclaw builds AI agents that live in messaging apps. Powered by Anthropic Claude.",
            "sameAs": [
              "https://twitter.com/ownyourclaw",
              "https://github.com/rathod965250/ownyourclaw"
            ]
          })
        }}
      />

      {/* WebSite schema — enables Google Sitelinks searchbox */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "ownyourclaw",
            "url": SITE_URL,
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/search?q={search_term_string}` },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* BreadcrumbList — gives Google context for page hierarchy */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
              { "@type": "ListItem", "position": 2, "name": "Pricing", "item": `${SITE_URL}/#pricing` },
              { "@type": "ListItem", "position": 3, "name": "Integrations", "item": `${SITE_URL}/#integrations` },
              { "@type": "ListItem", "position": 4, "name": "FAQ", "item": `${SITE_URL}/#faq` }
            ]
          })
        }}
      />

      <main
        className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden"
        aria-label="ownyourclaw homepage — AI agent on WhatsApp"
      >

        <Header user={user} />

        {/* ─── HERO ──────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-28 pb-20 px-6 overflow-hidden">
          {/* Dot Pattern — full section */}
          <DotPattern
            width={25}
            height={25}
            cx={1}
            cy={1}
            cr={2}
            className={cn(
              "fill-foreground/[0.10]",
              "[mask-image:radial-gradient(ellipse_90%_80%_at_50%_40%,white_20%,transparent_100%)]"
            )}
          />

          {/* Warm glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-primary/6 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

            {/* ── LEFT: Text content ───────────────────────── */}
            <div className="flex flex-col items-start">

              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  Now live · v1.0
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(2.6rem,6vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.95] mb-7 text-foreground">
                Your AI agent<br />
                on WhatsApp.<br />
                <span className="italic text-primary">Live in 60 seconds.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10 font-medium max-w-lg">
                Powered by Claude. Connects to Gmail, Notion, GitHub, Stripe and 20+ more.<br />
                <span className="text-foreground font-semibold">No setup. No terminal. No technical skills needed.</span>
              </p>

              {/* CTA */}
              <Link
                href="/signup"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-black text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 mb-4"
              >
                Get Started — ${cheapestPrice % 1 === 0 ? `$${cheapestPrice}` : `$${cheapestPrice.toFixed(2)}`}/mo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Trust line */}
              <p className="text-xs text-muted-foreground">
                Cancel anytime. Setup takes 60 seconds.
              </p>
            </div>

            {/* ── RIGHT: WhatsApp Phone mockup ─────────────── */}
            <div className="flex items-center justify-center lg:justify-end">
              {/* Phone shell */}
              <div className="relative w-[300px] sm:w-[340px]">
                {/* Glow behind phone */}
                <div className="absolute -inset-6 bg-primary/10 blur-[60px] rounded-full" />

                <div className="relative rounded-[40px] bg-[#111] border-[7px] border-[#222] shadow-2xl overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-[#075E54] px-5 pt-10 pb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-primary/30 border-2 border-primary/60 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-primary fill-primary" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-tight">ownyourclaw</p>
                        <p className="text-[#9EDCCA] text-[10px] font-medium">online</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat area */}
                  <div
                    className="px-3 py-4 flex flex-col gap-3 text-[13px]"
                    style={{ background: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23ECE5DD'/%3E%3C/svg%3E\")" }}
                  >
                    {/* User bubble */}
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] text-[#111] px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%] shadow-sm">
                        <p className="leading-snug">Am I free Thursday at 3pm?</p>
                        <p className="text-[9px] text-gray-400 text-right mt-1">9:41 AM ✓✓</p>
                      </div>
                    </div>

                    {/* Agent bubble */}
                    <div className="flex justify-start">
                      <div className="bg-white text-[#111] px-3 py-2 rounded-2xl rounded-tl-sm max-w-[82%] shadow-sm">
                        <p className="leading-snug">Yes — Thursday is clear from 1pm onwards. Want me to block 3–4pm for you? 📅</p>
                        <p className="text-[9px] text-gray-400 text-right mt-1">9:41 AM</p>
                      </div>
                    </div>

                    {/* User bubble */}
                    <div className="flex justify-end">
                      <div className="bg-[#DCF8C6] text-[#111] px-3 py-2 rounded-2xl rounded-tr-sm max-w-[75%] shadow-sm">
                        <p className="leading-snug">What emails need my attention today?</p>
                        <p className="text-[9px] text-gray-400 text-right mt-1">9:42 AM ✓✓</p>
                      </div>
                    </div>

                    {/* Agent bubble */}
                    <div className="flex justify-start">
                      <div className="bg-white text-[#111] px-3 py-2 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                        <p className="leading-snug">3 unread from important senders:<br />
                          <span className="font-semibold">Sarah (CFO)</span> — Q3 budget review<br />
                          <span className="font-semibold">Tom (client)</span> — project feedback<br />
                          <span className="font-semibold">Stripe</span> — payout processed ✅
                        </p>
                        <p className="text-[9px] text-gray-400 text-right mt-1">9:42 AM</p>
                      </div>
                    </div>

                    {/* Typing indicator */}
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="bg-[#F0F0F0] px-3 py-3 flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 text-[11px] text-gray-400 font-medium shadow-sm">
                      Message
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#075E54] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Floating badge — top right of phone */}
                <div className="absolute -top-3 -right-3 bg-background border border-border rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <span className="text-base">⚡</span>
                  <div>
                    <p className="text-[10px] font-black text-foreground leading-tight">Claude 3.5</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">Sonnet</p>
                  </div>
                </div>

                {/* Floating badge — bottom left */}
                <div className="absolute -bottom-3 -left-3 bg-background border border-border rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                  <span className="text-base">🔒</span>
                  <div>
                    <p className="text-[10px] font-black text-foreground leading-tight">End-to-end</p>
                    <p className="text-[9px] text-muted-foreground leading-tight">encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling ticker */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-border/50 bg-background/70 backdrop-blur-sm py-3">
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {["Gmail", "Notion", "GitHub", "Slack", "Calendar", "Stripe", "Twitter", "Linear", "Jira", "Trello", "Drive", "Webhooks",
                "Gmail", "Notion", "GitHub", "Slack", "Calendar", "Stripe", "Twitter", "Linear", "Jira", "Trello", "Drive", "Webhooks"].map((name, i) => (
                  <span key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {name}
                  </span>
                ))}
            </div>
          </div>
        </section>


        {/* ─── HOW IT WORKS ──────────────────────────────────────────── */}
        <section id="how-it-works" className="py-32 px-6 border-t border-border/50 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">How It Works</span>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0]">
                Three steps.<br />
                <span className="italic text-primary">Then magic.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed md:ml-auto md:max-w-sm">
                From zero to a fully operational AI assistant in under sixty seconds. No setup wizards. No API keys. No technical skills.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  emoji: "💳",
                  title: "Sign up and pick a plan",
                  time: "30 seconds",
                  desc: "Choose your plan, pay securely, you're in.",
                },
                {
                  step: "02",
                  emoji: "📱",
                  title: "Connect your WhatsApp",
                  time: "20 seconds",
                  desc: "Link your WhatsApp through Meta's official secure flow.",
                },
                {
                  step: "03",
                  emoji: "🤖",
                  title: "Just start messaging",
                  time: "10 seconds",
                  desc: "Your agent is live. Ask it anything about your email, calendar, tasks and more.",
                },
              ].map((item, i) => (
                <div key={i} className="relative group">
                  {/* Connector line between cards (desktop only) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-14 left-full w-6 h-px bg-border z-10 -translate-x-3" />
                  )}
                  <div className="p-8 rounded-lg border border-border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                    {/* Top row: emoji + step number */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {item.emoji}
                      </div>
                      <span className="text-5xl font-black text-border/60 select-none tabular-nums">{item.step}</span>
                    </div>

                    {/* Time badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 self-start mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{item.time}</span>
                    </div>

                    {/* Title + description */}
                    <h3 className="text-lg font-extrabold mb-2 tracking-tight text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm flex-grow">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ─── FEATURE CALLOUT ───────────────────────────────────────── */}
        <section className="py-32 px-6 border-t border-border/50 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
              {/* Dot pattern inside the feature box */}
              <DotPattern
                width={32}
                height={32}
                cx={1}
                cy={1}
                cr={0.6}
                className={cn(
                  "fill-foreground/[0.05]",
                  "[mask-image:radial-gradient(ellipse_60%_50%_at_100%_100%,white,transparent)]"
                )}
              />

              <div className="relative z-10 grid md:grid-cols-2 gap-0">
                {/* Left content */}
                <div className="p-12 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border/50">
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
                      <Sparkles className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.0] mb-6">
                      Claude 3.5 Sonnet.<br />
                      <span className="italic text-primary">Incredibly fast.</span>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-base mb-8 max-w-sm">
                      Powered by Anthropic's most capable model. Understands context, tone, and nuance — just like a brilliant human assistant would.
                    </p>
                  </div>
                  <Link
                    href="/signup"
                    className="group self-start flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
                  >
                    Start for free <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Right: Feature list */}
                <div className="p-12 md:p-16">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">What it can do</p>
                  <div className="space-y-6">
                    {[
                      { icon: <Mail className="w-4 h-4" />, label: "Read & reply to Gmail", sub: "Drafts, sends, and archives for you" },
                      { icon: <Database className="w-4 h-4" />, label: "Update your Notion", sub: "Pages, databases, and tasks" },
                      { icon: <Calendar className="w-4 h-4" />, label: "Manage your calendar", sub: "Creates, reschedules, and cancels events" },
                      { icon: <Github className="w-4 h-4" />, label: "Query GitHub issues", sub: "PR status, issue lists, CI results" },
                      { icon: <Slack className="w-4 h-4" />, label: "Post to Slack", sub: "In any channel, from any workspace" },
                      { icon: <Zap className="w-4 h-4" />, label: "Trigger Webhooks", sub: "Custom automations on demand" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING ───────────────────────────────────────────────── */}
        <section id="pricing" className="py-32 px-6 border-t border-border/50 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Pricing</span>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0]">
                Simple,<br />
                <span className="italic text-primary">honest pricing.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed md:ml-auto md:max-w-xs">
                No hidden fees. No usage traps. Cancel any time, no questions asked.
              </p>
            </div>

            {/* Real pricing from Dodo Payments */}
            <PricingSection products={products} />
          </div>
        </section>

        {/* ─── INTEGRATIONS ──────────────────────────────────────────── */}
        <section id="integrations" className="py-32 px-6 border-t border-border/50">
          <div className="max-w-6xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Integrations</span>
            </div>

            {/* Section header */}
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4 max-w-2xl">
                Your agent connects to<br />
                <span className="italic text-primary">everything you already use.</span>
              </h2>
            </div>

            {/* Client component handles onError favicon fallback */}
            <IntegrationsGrid />
          </div>
        </section>


        {/* ─── CTA BANNER ────────────────────────────────────────────── */}
        <section className="py-32 px-6 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-primary/30 bg-card overflow-hidden px-12 py-20 text-center">
              {/* Dot pattern accent */}
              <DotPattern
                width={32}
                height={32}
                cx={1}
                cy={1}
                cr={0.6}
                className={cn(
                  "fill-primary/8",
                  "[mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,white,transparent)]"
                )}
              />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Start Today</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0] mb-6">
                  Ready to own<br />
                  <span className="italic text-primary">your claw?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
                  Join thousands of founders, freelancers, and professionals who automate their work through WhatsApp.
                </p>
                <Link
                  href="/signup"
                  className="group inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                >
                  Get started — it's free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="mt-4 text-xs text-muted-foreground">No credit card required · Cancel anytime</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FAQ ────────────────────────────────────────────────────── */}
        {/* FAQPage JSON-LD — picked up by Google rich results + AI crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is this the official WhatsApp? Will my account get banned?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes — we use Meta's official WhatsApp Cloud API, the same infrastructure used by major banks and airlines. Your account is fully compliant with WhatsApp's terms of service. Zero risk of banning."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Will it send emails or post things without asking me?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Never. Every write action — sending an email, creating a calendar event, posting a tweet — shows you a preview first and waits for your confirmation. Nothing is sent without you saying yes."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can the agent see my passwords or API keys?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Never. Your credentials are encrypted and stored separately from the agent. The agent only ever receives the data it asked for — never the keys used to fetch it."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Do I need any technical skills?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "None. If you can send a WhatsApp message, you can use OwnYourClaw. No terminal, no code, no setup beyond a 60-second onboarding."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What if I want to cancel?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cancel from your dashboard in one click. Your subscription stops at the end of your billing period. No cancellation fees, no retention emails, no questions asked."
                  }
                }
              ]
            })
          }}
        />

        <section id="faq" className="py-32 px-6 border-t border-border/50">
          <div className="max-w-3xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-16">
              Frequently asked<br />
              <span className="italic text-primary">questions.</span>
            </h2>

            {/* FAQ accordion items */}
            <div className="divide-y divide-border">
              {[
                {
                  q: "Is this the official WhatsApp? Will my account get banned?",
                  a: "Yes — we use Meta's official WhatsApp Cloud API, the same infrastructure used by major banks and airlines. Your account is fully compliant with WhatsApp's terms of service. Zero risk of banning."
                },
                {
                  q: "Will it send emails or post things without asking me?",
                  a: "Never. Every write action — sending an email, creating a calendar event, posting a tweet — shows you a preview first and waits for your confirmation. Nothing is sent without you saying yes."
                },
                {
                  q: "Can the agent see my passwords or API keys?",
                  a: "Never. Your credentials are encrypted and stored separately from the agent. The agent only ever receives the data it asked for — never the keys used to fetch it."
                },
                {
                  q: "Do I need any technical skills?",
                  a: "None. If you can send a WhatsApp message, you can use OwnYourClaw. No terminal, no code, no setup beyond a 60-second onboarding."
                },
                {
                  q: "What if I want to cancel?",
                  a: "Cancel from your dashboard in one click. Your subscription stops at the end of your billing period. No cancellation fees, no retention emails, no questions asked."
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group py-7 cursor-pointer list-none [&::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-start justify-between gap-6 select-none list-none">
                    <h3 className="text-base md:text-lg font-bold text-foreground leading-snug pr-2">
                      {item.q}
                    </h3>
                    {/* +/× icon */}
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center text-muted-foreground group-open:border-primary group-open:text-primary transition-colors">
                      <svg
                        className="w-3 h-3 rotate-0 group-open:rotate-45 transition-transform duration-200"
                        fill="none"
                        viewBox="0 0 12 12"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground leading-relaxed text-[15px] pr-12">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ────────────────────────────────────────────────── */}
        <footer className="py-16 px-6 border-t border-border/50 bg-background">

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              {/* Brand */}
              <div className="md:col-span-2">
                <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
                    <Zap className="w-4 h-4 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <span className="font-black text-lg tracking-tight text-foreground">
                    ownyour<span className="text-primary">claw</span>
                  </span>
                </Link>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  Your personal AI assistant, living directly in your WhatsApp. Designed for speed, built for privacy.
                </p>
              </div>

              {/* Product links */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-5">Product</h4>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
                  <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
                  <a href="#integrations" className="hover:text-primary transition-colors">Integrations</a>
                  <Link href="/login" className="hover:text-primary transition-colors">Dashboard</Link>
                </div>
              </div>

              {/* Legal links */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-5">Legal</h4>
                <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                  <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} ownyourclaw. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Built with ♥ for human productivity.
              </p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}

