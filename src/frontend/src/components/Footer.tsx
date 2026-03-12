import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Subscribed! You'll receive updates soon.");
      setEmail("");
    }
  };

  const socialLinks = [
    { icon: Twitter, label: "Twitter" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Github, label: "GitHub" },
    { icon: Mail, label: "Email" },
  ];

  const quickLinks = ["Features", "Pricing", "Contact Us"];
  const resourceLinks = [
    "Documentation",
    "Blog",
    "Case Studies",
    "Support Center",
  ];

  return (
    <footer className="border-t border-border/40 bg-card/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/assets/generated/smart-survey-ai-logo-transparent.dim_400x200.png"
              alt="Smart Survey AI"
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transforming employee feedback into actionable insights through
              the power of AI.
            </p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Get the latest insights on employee engagement and AI.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground shrink-0"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
