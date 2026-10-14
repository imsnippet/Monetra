import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import Logo from "@/components/logo/logo";
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from "@/routes/common/routePath";
import { copyEmailAndOpenMailto } from "@/lib/contact";
import { SupportModal } from "@/components/support-modal";

const productLinks = [
  { label: "Overview", href: PROTECTED_ROUTES.OVERVIEW },
  { label: "Transactions", href: PROTECTED_ROUTES.TRANSACTIONS },
  { label: "Budgeting", href: PROTECTED_ROUTES.BUDGET },
  { label: "Reports", href: PROTECTED_ROUTES.REPORTS },
  { label: "About Monetra", href: PUBLIC_ROUTES.ABOUT },
];

const developerLinks = [
  {
    label: "Developer GitHub",
    href: "https://github.com/imsnippet",
  },
  {
    label: "Developer LinkedIn",
    href: "https://www.linkedin.com/in/subhankashif",
  },
  {
    label: "Contact Email",
    href: "mailto:imsnippet@gmail.com",
  },
];

const legalLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
  { label: "About & Tech Stack", href: "/about" },
];

const LandingFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <footer className="bg-app-dark text-white pt-16 md:pt-20 pb-8 md:pb-12 border-t border-white/5">
      <SupportModal isOpen={isSupportOpen} onOpenChange={setIsSupportOpen} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mb-12 md:mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo url="/" />
            </div>
            <p className="text-white/50 mb-6 leading-relaxed text-sm">
              Your Money. Smarter. Precision multi-currency tracking, intelligent budgeting, and AI-assisted personal finance.
            </p>
            <div className="flex gap-4 items-center">
              <a
                href="https://github.com/imsnippet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-brand-green-light transition-colors"
                title="Developer GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/subhankashif"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-brand-green-light transition-colors"
                title="Developer LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <button
                type="button"
                onClick={(e) => copyEmailAndOpenMailto("imsnippet@gmail.com", "Contact Developer - Monetra", e)}
                className="text-white/40 hover:text-brand-green-light transition-colors cursor-pointer bg-transparent border-none p-0 inline-flex items-center justify-center"
                title="Click to copy email address & launch mail client"
                aria-label="Email Developer"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white/40">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white/40">
              Maintainer & Community
            </h4>
            <ul className="space-y-3">
              {developerLinks.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("mailto:") ? (
                    <button
                      type="button"
                      onClick={(e) => copyEmailAndOpenMailto("imsnippet@gmail.com", "Monetra Inquiry", e)}
                      className="text-white/50 hover:text-white transition-colors text-sm text-left cursor-pointer bg-transparent border-none p-0"
                      title="Click to copy email address & launch mail client"
                    >
                      {label}
                    </button>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-white/40">
              Account & Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setIsSupportOpen(true)}
                  className="text-white/50 hover:text-brand-green-light transition-colors text-sm cursor-pointer"
                >
                  Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left text-sm text-white/30">
          <div>
            © {currentYear} Monetra. Built and maintained by the Monetra project developer.
          </div>
          <div className="font-medium">
            <span className="text-brand-green-light italic">Your Money.</span> Smarter.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
