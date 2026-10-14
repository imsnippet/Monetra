import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTypedSelector } from "@/app/hook";
import { useTheme } from "@/context/theme-provider";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import Logo from "@/components/logo/logo";
import { SupportModal } from "@/components/support-modal";

interface HomeNavigationProps {
  scrollToSection: (sectionId: string) => void;
  scrollToTop: () => void;
}

const Navigation = ({ scrollToSection, scrollToTop }: HomeNavigationProps) => {
  const { user, accessToken } = useTypedSelector((state) => state.auth);
  const isAuthenticated = !!(user && accessToken);
  const { theme, setTheme } = useTheme();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) setIsVisible(true);
      else if (currentScrollY > lastScrollY && currentScrollY > 100) setIsVisible(false);
      else if (currentScrollY < lastScrollY) setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const navLinks = [
    { label: "Features", id: "features" },
    { label: "How it works", id: "how-it-works" },
  ];

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-background/80 backdrop-blur-xl border border-border/60 rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">

        <button className="flex items-center gap-2.5 cursor-pointer bg-transparent border-none p-0" onClick={scrollToTop} aria-label="Monetra home">
          <Logo url="" />
        </button>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <Link to="/about" className="hover:text-primary transition-colors">
            About
          </Link>
          <button
            type="button"
            onClick={() => setIsSupportOpen(true)}
            className="hover:text-primary transition-colors cursor-pointer font-medium"
          >
            Support
          </button>
        </div>

        <SupportModal isOpen={isSupportOpen} onOpenChange={setIsSupportOpen} />

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
          </Button>

          {isAuthenticated ? (
            <Button
              size="sm"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 text-sm font-semibold shadow-md transition-all"
            >
              <Link to="/overview">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 hover:bg-muted/60 rounded-full transition-all"
              >
                <Link to="/sign-in">Sign in</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full hover:bg-primary/90 transition-all shadow-md"
              >
                <Link to="/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navigation;
