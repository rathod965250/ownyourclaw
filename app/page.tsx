import { getUser } from "@/actions/get-user";
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

export default async function Home() {
  const userRes = await getUser();
  const user = userRes.success ? userRes.data : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <Header user={user} />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-24 px-6 overflow-hidden">
        {/* Dot Pattern background */}
        <DotPattern
          width={25}
          height={25}
          cx={1}
          cy={1}
          cr={2}
          className={cn(
            "fill-foreground/[0.10]",
            "[mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,white_30%,transparent_100%)]"
          )}
        />

        {/* Subtle warm glow at center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[400px] bg-primary/8 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2.5 mb-10 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
              Now available · v1.0
            </span>
          </div>

          {/* Main headline — pure editorial */}
          <h1 className="text-[clamp(3rem,9vw,7rem)] font-black tracking-[-0.04em] leading-[0.92] mb-8 text-foreground">
            Your AI agent.<br />
            <span className="italic font-extrabold text-primary">On WhatsApp.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Powered by Claude. Connects to Gmail, Notion, GitHub and 20+ more.
            Live in sixty seconds — no technical skills needed.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group w-full sm:w-auto px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-lg border border-border bg-card font-bold text-base hover:bg-muted transition-all flex items-center justify-center gap-2 text-foreground"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof nudge */}
          <p className="mt-6 text-xs text-muted-foreground tracking-wide">
            No credit card required · Cancel anytime · SOC 2 compliant
          </p>
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
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Process</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0]">
              Three steps.<br />
              <span className="italic font-extrabold text-primary">Then magic.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed md:max-w-sm md:ml-auto">
              From zero to a fully operational AI assistant in under sixty seconds. No setup wizards. No API keys. Just a QR code.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: "Sign up & pay",
                desc: "Create your account and select a plan. The entire flow takes under 30 seconds.",
                tag: "30s",
              },
              {
                step: "02",
                icon: <QrCode className="w-6 h-6 text-primary" />,
                title: "Scan the QR code",
                desc: "Link your WhatsApp account with one scan. No phone number sharing required.",
                tag: "Instant",
              },
              {
                step: "03",
                icon: <MessageSquare className="w-6 h-6 text-primary" />,
                title: "Start chatting",
                desc: "Ask your AI to read emails, draft replies, update tasks, or set reminders — all from WhatsApp.",
                tag: "Live",
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="p-8 rounded-lg border border-border bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-5xl font-black text-border select-none">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm flex-grow">{item.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 self-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{item.tag}</span>
                  </div>
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

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="p-8 rounded-lg border border-border bg-card flex flex-col group hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Starter</p>
              <div className="mb-8">
                <span className="text-5xl font-black tracking-tighter text-foreground">$12</span>
                <span className="text-muted-foreground text-sm ml-1">/month</span>
              </div>
              <div className="h-px bg-border mb-8" />
              <ul className="space-y-3 flex-grow mb-8">
                {["500 messages / mo", "Standard latency", "Gmail + Notion", "Community support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=starter" className="block w-full py-3 text-center rounded-lg border border-border font-bold text-sm hover:bg-muted transition-colors">
                Get started
              </Link>
            </div>

            {/* Personal — highlighted */}
            <div className="p-8 rounded-lg border-2 border-primary bg-background flex flex-col relative shadow-2xl shadow-primary/10 md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-6">Personal</p>
              <div className="mb-8">
                <span className="text-6xl font-black tracking-tighter text-foreground">$22</span>
                <span className="text-muted-foreground text-sm ml-1">/month</span>
              </div>
              <div className="h-px bg-border mb-8" />
              <ul className="space-y-3 flex-grow mb-8">
                {["Unlimited messages", "Priority latency", "All 20+ integrations", "Voice note support", "Email support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=personal" className="block w-full py-3.5 text-center rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                Get started
              </Link>
            </div>

            {/* Teams */}
            <div className="p-8 rounded-lg border border-border bg-card flex flex-col group hover:shadow-lg transition-all duration-300">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Teams</p>
              <div className="mb-8">
                <span className="text-5xl font-black tracking-tighter text-foreground">$49</span>
                <span className="text-muted-foreground text-sm ml-1">/month</span>
              </div>
              <div className="h-px bg-border mb-8" />
              <ul className="space-y-3 flex-grow mb-8">
                {["Up to 5 members", "Shared memory", "Everything in Personal", "Admin dashboard", "Priority support"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=teams" className="block w-full py-3 text-center rounded-lg border border-border font-bold text-sm hover:bg-muted transition-colors">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTEGRATIONS ──────────────────────────────────────────── */}
      <section id="integrations" className="py-32 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Integrations</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.0]">
              20+ tools.<br />
              <span className="italic text-primary">One chat.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed md:ml-auto md:max-w-xs">
              Connect everything you use without leaving WhatsApp. New integrations drop every sprint.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {[
              { icon: <Mail className="w-5 h-5" />, name: "Gmail", color: "text-red-500" },
              { icon: <Github className="w-5 h-5" />, name: "GitHub", color: "text-foreground" },
              { icon: <Database className="w-5 h-5" />, name: "Notion", color: "text-foreground" },
              { icon: <Chrome className="w-5 h-5" />, name: "Google", color: "text-amber-500" },
              { icon: <Slack className="w-5 h-5" />, name: "Slack", color: "text-emerald-600" },
              { icon: <Twitter className="w-5 h-5" />, name: "Twitter", color: "text-sky-500" },
              { icon: <Instagram className="w-5 h-5" />, name: "Instagram", color: "text-rose-500" },
              { icon: <Globe className="w-5 h-5" />, name: "Web", color: "text-indigo-500" },
              { icon: <Lock className="w-5 h-5" />, name: "Auth", color: "text-muted-foreground" },
              { icon: <ShieldCheck className="w-5 h-5" />, name: "Privacy", color: "text-primary" },
              { icon: <Cloud className="w-5 h-5" />, name: "Drive", color: "text-sky-400" },
              { icon: <Layers className="w-5 h-5" />, name: "Linear", color: "text-primary" },
              { icon: <MousePointer2 className="w-5 h-5" />, name: "ClickUp", color: "text-primary" },
              { icon: <Calendar className="w-5 h-5" />, name: "Calendar", color: "text-primary" },
              { icon: <Layout className="w-5 h-5" />, name: "Trello", color: "text-blue-500" },
              { icon: <Terminal className="w-5 h-5" />, name: "Scripts", color: "text-foreground" },
              { icon: <Code2 className="w-5 h-5" />, name: "Jira", color: "text-cyan-600" },
              { icon: <Cpu className="w-5 h-5" />, name: "Claude AI", color: "text-orange-500" },
              { icon: <Zap className="w-5 h-5" />, name: "Webhooks", color: "text-primary" },
              { icon: <MessageSquare className="w-5 h-5" />, name: "Discord", color: "text-indigo-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="aspect-square p-4 rounded-lg border border-border bg-card flex flex-col items-center justify-center gap-2.5 hover:border-primary/40 hover:shadow-md transition-all duration-200 cursor-default group"
              >
                <div className={cn("transition-transform duration-300 group-hover:scale-110", item.color)}>
                  {item.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
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

    </div>
  );
}
