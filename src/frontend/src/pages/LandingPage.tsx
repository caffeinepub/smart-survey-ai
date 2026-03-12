import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Brain,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  GitBranch,
  Lightbulb,
  MessageSquare,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

const features = [
  {
    icon: Shield,
    title: "100% Anonymous Feedback",
    desc: "Strong encryption and advanced anonymization ensure complete anonymity for all respondents, fostering honest and candid feedback.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    desc: "Advanced ML algorithms uncover hidden patterns and predict trends, giving you actionable intelligence from your data.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: MessageSquare,
    title: "Real-time Sentiment Analysis",
    desc: "Advanced emotional intelligence engine processes feedback in real-time to gauge employee mood and satisfaction levels.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Search,
    title: "Topic Modeling & Analysis",
    desc: "NLP-based topic modeling automatically categorizes and clusters themes across thousands of responses.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: GitBranch,
    title: "Multiple Campaigns",
    desc: "Run unlimited parallel surveys, compare results and cross-reference data across teams, departments, and time periods.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BarChart3,
    title: "Visual Analytics & Reports",
    desc: "Generate beautiful insightful reports and export visualizations to share with stakeholders at any level.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const steps = [
  {
    num: "01",
    title: "Survey Distribution",
    desc: "Automated distribution of customized surveys at regular intervals to the right people at the right time.",
  },
  {
    num: "02",
    title: "Data Collection",
    desc: "Secure collection of anonymous feedback through our intuitive platform, optimized for high response rates.",
  },
  {
    num: "03",
    title: "AI Analysis",
    desc: "AI-powered analysis to identify trends, patterns, and sentiment indicators across your organization.",
  },
  {
    num: "04",
    title: "Action Planning",
    desc: "Generation of actionable insights and recommendations to improve engagement and workplace culture.",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Track Engagement",
    desc: "eNPS provides a standardized way to track employee engagement over time with comparable metrics.",
  },
  {
    icon: Search,
    title: "Identify Issues",
    desc: "Quickly identify areas for improvement before they escalate into larger organizational problems.",
  },
  {
    icon: Award,
    title: "Benchmark Performance",
    desc: "Compare performance over time and against industry standards to stay competitive.",
  },
  {
    icon: Users,
    title: "Improve Culture",
    desc: "Understand what drives high employee satisfaction and build a culture people love.",
  },
  {
    icon: Lightbulb,
    title: "Make Better Decisions",
    desc: "Leverage comprehensive feedback data for informed, evidence-based organizational decisions.",
  },
  {
    icon: Clock,
    title: "Time & Cost Efficient",
    desc: "Automated processes significantly reduce administrative overhead, saving time and resources.",
  },
];

const chatPrompts = [
  "How can I improve employee engagement?",
  "Show me the latest sentiment analysis.",
  "What are the top feedback trends this month?",
];

interface ChatMessage {
  id: number;
  role: string;
  text: string;
}

export default function LandingPage() {
  const [chatInput, setChatInput] = useState("");
  const msgIdRef = useRef(2);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I'm your AI assistant for employee engagement. How can I help you today?",
    },
  ]);

  const handleSendChat = (message?: string) => {
    const text = message || chatInput;
    if (!text.trim()) return;
    const userId = msgIdRef.current++;
    const botId = msgIdRef.current++;
    setChatMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text },
      {
        id: botId,
        role: "assistant",
        text: "Great question! Our AI platform analyzes thousands of data points to give you actionable insights. Create a free survey to get started with real data from your team.",
      },
    ]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen mesh-bg">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium mb-6"
            >
              <Sparkles size={12} />
              AI-Powered Employee Engagement
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Transform Your Employee Feedback Into{" "}
              <span className="gradient-text">Actionable Insights</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              Smart Survey AI is your intelligent assistant for employee
              engagement, sentiment analysis, and feedback management. Harness
              the power of AI to understand your workforce like never before.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-3"
            >
              <Link to="/forms">
                <Button
                  size="lg"
                  data-ocid="hero.cta_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                >
                  Start Free Survey
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary"
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="mt-8 flex items-center gap-6"
            >
              {[
                { num: "10k+", label: "Surveys Created" },
                { num: "98%", label: "Satisfaction Rate" },
                { num: "50+", label: "Countries" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold gradient-text">
                    {stat.num}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Chat Demo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="glass-card gradient-border rounded-2xl overflow-hidden"
          >
            <div className="bg-secondary/50 px-4 py-3 border-b border-border/30 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-chart-4/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent/70" />
              <span className="ml-2 text-xs text-muted-foreground">
                Smart Survey AI Assistant
              </span>
            </div>

            <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-2 mb-3">
                {chatPrompts.map((prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    onClick={() => handleSendChat(prompt)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-accent/20 text-muted-foreground hover:text-accent border border-border/50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  data-ocid="hero.chat_input"
                  placeholder="Ask me anything about your team..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                  className="bg-secondary/60 border-border/50 text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => handleSendChat()}
                  className="bg-primary text-primary-foreground shrink-0"
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-medium mb-4">
            <Eye size={12} /> Platform Features
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Understand Your Team</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven tools to collect, analyze, and act on employee
            feedback at scale.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="glass-card gradient-border rounded-2xl p-6 hover:bg-card/60 transition-all duration-300 group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <f.icon size={24} className={f.color} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-medium mb-4">
            <ChevronRight size={12} /> How It Works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Simple, Powerful, <span className="gradient-text">Effective</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From survey creation to actionable insights in four easy steps.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center relative"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center mb-4 relative z-10">
                  <span className="font-display text-2xl font-bold gradient-text">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        id="benefits"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-medium mb-4">
            <CheckCircle size={12} /> Why Choose Us
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Real Business <span className="gradient-text">Benefits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Companies using Smart Survey AI see measurable improvements in
            engagement and retention.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="flex gap-4 p-5 glass-card rounded-xl hover:bg-card/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <b.icon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass-card gradient-border rounded-3xl p-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Your{" "}
            <span className="gradient-text">Workplace?</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of organizations using Smart Survey AI to create
            happier, more productive teams.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/forms">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
              >
                Get Started Free
                <ChevronRight size={16} className="ml-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-border">
              Schedule a Demo
            </Button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
