import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { identity, clear } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Benefits", href: "/#benefits" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Contact", href: "/#contact" },
    { label: "Blog", href: "/#blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/assets/generated/smart-survey-ai-logo-transparent.dim_400x200.png"
              alt="Smart Survey AI"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}_link`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/forms">
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid="nav.create_survey_button"
                    className="border-primary/40 text-primary hover:bg-primary/10"
                  >
                    My Surveys
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clear()}
                  className="text-muted-foreground"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  data-ocid="nav.login_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/30 px-4 py-4 flex flex-col gap-3"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border/30">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link to="/forms" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/40 text-primary"
                    >
                      My Surveys
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clear();
                      setIsOpen(false);
                    }}
                    className="w-full text-muted-foreground"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full bg-primary text-primary-foreground"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
