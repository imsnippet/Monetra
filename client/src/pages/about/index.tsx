import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  Code2,
  Mail,
  Github,
  Linkedin,
  ArrowRight,
  TrendingUp,
  Cpu,
  Globe,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonetraEmblem } from "@/components/logo/monetra-logo";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/routes/common/routePath";
import { copyEmailAndOpenMailto } from "@/lib/contact";
import { SupportModal } from "@/components/support-modal";

export const AboutPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Banner / Navigation */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={PUBLIC_ROUTES.HOME} className="flex items-center gap-2.5">
            <MonetraEmblem size={32} />
            <span className="font-bold text-xl tracking-tight">Monetra</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild size="sm">
              <Link to={PUBLIC_ROUTES.HOME}>Home</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to={PROTECTED_ROUTES.OVERVIEW}>Open Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary dark:text-[#9fff59] text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Your Money. Smarter.
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Meet <span className="text-primary dark:text-[#9fff59]">Monetra</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              A distinctive, full-stack personal finance platform engineered for precision, multi-currency clarity, intelligent budgeting, and AI-assisted financial mastery.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-sm">
                <Link to={PROTECTED_ROUTES.OVERVIEW}>
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 cursor-pointer"
                onClick={(e) => copyEmailAndOpenMailto("imsnippet@gmail.com", "Contact Developer - Monetra", e)}
                title="Click to copy email address & launch mail client"
              >
                <Mail className="mr-2 w-4 h-4" /> Contact Developer
              </Button>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Engineered for Complete Financial Control</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built on authoritative calculations, real-time FX conversions, and resilient architecture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border/60 bg-card hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Globe className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Multi-Currency Engine</CardTitle>
                <CardDescription>
                  Tracks original amounts and converts to your base currency using cached, timestamped exchange rates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/60 bg-card hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Smart Budgeting & Goals</CardTitle>
                <CardDescription>
                  Configure monthly thresholds, track target progress with dynamic visualizations, and eliminate overspending.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/60 bg-card hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Cpu className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">AI-Assisted Operations</CardTitle>
                <CardDescription>
                  Speech-to-transaction parsing and computer vision receipt scanning with human review before saving.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Technology Stack & Security */}
        <section className="py-16 bg-muted/30 border-y border-border/40">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  <Layers className="w-4 h-4" /> Robust Stack
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Modern Technology Architecture</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Monetra is architected with cutting-edge open-source technologies:
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <strong>Frontend:</strong> React 19, Vite, Tailwind CSS v4, Radix UI primitives, Recharts, and TanStack Table.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <strong>Backend:</strong> NestJS 10, Express 4, TypeScript, Passport JWT auth rotation, Drizzle ORM.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <strong>Data Integrity:</strong> Monomorphic minor unit arithmetic for financial sums and strict authorization isolation.
                  </li>
                </ul>
              </div>

              <Card className="border-border/60 bg-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-7 h-7 text-primary" />
                  <div>
                    <h4 className="font-semibold text-base">Privacy & Security Principles</h4>
                    <p className="text-xs text-muted-foreground">User-first data ownership</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Financial calculations are executed on the backend using authoritative records. User data is strictly isolated with server-side ownership verification on all requests. Third-party integrations require explicit user action.
                </p>
                <div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
                  Open-source contributions and third-party libraries respect respective licenses and upstream attributions.
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Developer & Project Attribution */}
        <section className="py-16 container max-w-5xl mx-auto px-4">
          <Card className="border-border/60 bg-card overflow-hidden">
            <div className="p-8 md:p-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  <Code2 className="w-4 h-4" /> Project Maintainer
                </div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">About the Developer</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Built and maintained by the Monetra project developer. Connect via the official developer profiles below:
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  <Button variant="outline" asChild size="sm" className="rounded-full">
                    <a href="https://github.com/imsnippet" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 w-4 h-4" /> GitHub Profile
                    </a>
                  </Button>
                  <Button variant="outline" asChild size="sm" className="rounded-full">
                    <a href="https://www.linkedin.com/in/subhankashif" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 w-4 h-4" /> LinkedIn Profile
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full group cursor-pointer"
                    onClick={async (e) => {
                      await copyEmailAndOpenMailto("imsnippet@gmail.com", "Developer Inquiry - Monetra", e);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    title="Click to copy imsnippet@gmail.com & launch mail app"
                  >
                    {copied ? (
                      <Check className="mr-2 w-4 h-4 text-emerald-500" />
                    ) : (
                      <Mail className="mr-2 w-4 h-4 text-primary" />
                    )}
                    imsnippet@gmail.com
                    <Copy className="ml-2 w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  For bug reports, technical inquiries, or feature proposals, reach out directly at{" "}
                  <button
                    type="button"
                    onClick={(e) => copyEmailAndOpenMailto("imsnippet@gmail.com", "Bug Report / Feedback - Monetra", e)}
                    className="text-primary underline hover:opacity-80 font-medium inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 align-baseline"
                    title="Click to copy email address & launch mail app"
                  >
                    imsnippet@gmail.com
                  </button>.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="border-t border-border/40 py-8 bg-card/40 text-xs text-muted-foreground">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MonetraEmblem size={20} />
            <span className="font-semibold text-foreground">Monetra</span>
            <span>— Your Money. Smarter.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={PUBLIC_ROUTES.HOME} className="hover:text-foreground">Home</Link>
            <Link to={PROTECTED_ROUTES.OVERVIEW} className="hover:text-foreground">Dashboard</Link>
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="hover:text-foreground cursor-pointer bg-transparent border-none p-0 text-xs text-muted-foreground"
              title="Support Independent Development"
            >
              Support
            </button>
            <a href="https://github.com/imsnippet" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Developer</a>
          </div>
          <div>© {new Date().getFullYear()} Monetra. All rights reserved.</div>
        </div>
      </footer>
      <SupportModal isOpen={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </div>
  );
};

export default AboutPage;
