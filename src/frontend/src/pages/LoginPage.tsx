import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield, Sparkles, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoginError, isLoggingIn, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/forms" });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-card gradient-border rounded-3xl p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Sparkles size={32} className="text-primary" />
            </div>

            <h1 className="font-display text-3xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to access your surveys, analytics, and insights.
            </p>

            <Button
              size="lg"
              onClick={() => login()}
              disabled={isLoggingIn}
              data-ocid="login.primary_button"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow h-12 text-base"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Sign In with Internet Identity"
              )}
            </Button>

            {isLoginError && (
              <p
                data-ocid="login.error_state"
                className="mt-4 text-sm text-destructive"
              >
                Login failed. Please try again.
              </p>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: Shield, label: "Secure" },
                { icon: Zap, label: "Fast" },
                { icon: Sparkles, label: "AI-Powered" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon size={14} className="text-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
