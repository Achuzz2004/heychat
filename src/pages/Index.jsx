import { useEffect } from "react";
import { SEO } from "@/config";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const Index = () => {
  useEffect(() => {
    document.title = SEO.title;
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
          <div className="w-[120vmax] h-[120vmax] rounded-full bg-gradient-primary blur-3xl -translate-x-1/3 -translate-y-1/3" />
        </div>
        <header className="container flex items-center justify-between py-6 relative z-10">
          <h1 className="text-2xl font-semibold">Chatter</h1>
          <ThemeToggle />
        </header>
        <main className="container relative z-10">
          <section className="py-20 text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Secure real‑time chat for everyone</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">End‑to‑end encryption, message receipts, media sharing, and presence — wrapped in a beautiful WhatsApp‑style interface.</p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login"><Button size="lg">Open Chatter</Button></Link>
              <Link to="/register"><Button variant="secondary" size="lg">Create account</Button></Link>
            </div>
          </section>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
