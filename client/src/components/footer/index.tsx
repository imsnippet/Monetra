import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { MonetraEmblem } from "@/components/logo/monetra-logo";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { copyEmailAndOpenMailto } from "@/lib/contact";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm py-6 text-xs text-muted-foreground mt-auto">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <MonetraEmblem size={22} />
          <span className="font-semibold text-foreground tracking-tight">Monetra</span>
          <span className="text-muted-foreground/60 hidden sm:inline">|</span>
          <span className="text-muted-foreground hidden sm:inline">Your Money. Smarter.</span>
        </div>

        {/* Quick Nav */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to={PROTECTED_ROUTES.OVERVIEW} className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to={PROTECTED_ROUTES.TRANSACTIONS} className="hover:text-foreground transition-colors">
            Transactions
          </Link>
          <Link to={PROTECTED_ROUTES.BUDGET} className="hover:text-foreground transition-colors">
            Budget
          </Link>
          <Link to={PUBLIC_ROUTES.ABOUT} className="hover:text-foreground transition-colors font-medium text-foreground/80">
            About Monetra
          </Link>
        </div>

        {/* Official Developer Attribution & Links */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground/80 hidden lg:inline">
            Built by Monetra project developer:
          </span>
          <a
            href="https://github.com/imsnippet"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors p-1"
            title="GitHub"
            aria-label="Developer GitHub"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://www.linkedin.com/in/subhankashif"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors p-1"
            title="LinkedIn"
            aria-label="Developer LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={(e) => copyEmailAndOpenMailto("imsnippet@gmail.com", "Contact Email - Monetra", e)}
            className="hover:text-foreground transition-colors p-1 cursor-pointer bg-transparent border-none"
            title="Click to copy email address & launch mail client"
            aria-label="Contact Email"
          >
            <Mail className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;