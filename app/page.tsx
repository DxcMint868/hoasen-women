import { createClient } from "@/lib/supabase/server";
import ProfileGrid from "@/components/profile-grid";
import AnimatedMeetingHeadline from "@/components/animated-meeting-headline";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: women, error } = await supabase
    .from("women_profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const isDatabaseNotInitialized = error?.message?.includes(
    "Could not find the table"
  );

  if (error) {
    console.error("Error fetching women profiles:", error);
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(160deg, #3B1578 0%, #2d1b4e 50%, #1a0a30 100%)" }}
    >
      {/* Gold noise across the entire page */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url(/textures/gold-noise.png)",
          backgroundSize: "280px",
          opacity: 0.045,
          mixBlendMode: "screen",
        }}
      />
      {/* Gold fluid top sweep */}
      <div
        className="absolute top-0 left-0 right-0 h-[420px] pointer-events-none z-0"
        style={{
          backgroundImage: "url(/textures/gold-fluid.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.1,
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* Gold radial glow — top left */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] pointer-events-none z-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,200,66,0.1) 0%, transparent 70%)" }}
      />
      {/* Gold radial glow — bottom right */}
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] pointer-events-none z-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)" }}
      />
      {/* Top gold accent line */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-0"
        style={{ top: 1, height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(245,200,66,0.35) 30%, rgba(245,200,66,0.55) 50%, rgba(245,200,66,0.35) 70%, transparent 100%)" }}
      />

      <SiteHeader />

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-20">
          {/* IWD date badge */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.5))" }} />
            <span className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: "rgba(245,200,66,0.8)" }}>
              March 8 · International Women&apos;s Day 2026
            </span>
            <div className="h-px w-12" style={{ background: "linear-gradient(90deg, rgba(245,200,66,0.5), transparent)" }} />
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-3 text-balance" style={{ letterSpacing: "-0.02em" }}>
            Honor the Women
          </h2>
          <h2 className="text-5xl sm:text-6xl font-bold text-balance mb-6" style={{ letterSpacing: "-0.02em", color: "#F5C842" }}>
            of Hoasen
          </h2>

          {/* Gold rule */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-24" style={{ background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.5))" }} />
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M7 0 L8.2 5.3 L13.5 7 L8.2 8.7 L7 14 L5.8 8.7 L0.5 7 L5.8 5.3 Z"
                fill="#F5C842" fillOpacity="0.7" />
            </svg>
            <div className="h-px w-24" style={{ background: "linear-gradient(90deg, rgba(245,200,66,0.5), transparent)" }} />
          </div>

          <p className="text-base text-white/70 max-w-xl mx-auto text-balance font-light leading-relaxed">
            Click your card to unlock your letter and gift.
          </p>
          <AnimatedMeetingHeadline />
        </div>

        {isDatabaseNotInitialized ? (
          <div className="max-w-2xl mx-auto bg-white/95 border-2 border-white/50 rounded-3xl p-8 mb-8 backdrop-blur-sm shadow-lg">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Database Setup Required
            </h3>
            <p className="text-muted-foreground mb-4">
              The database tables need to be initialized. Please follow these
              steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
              <li>
                Go to your Supabase dashboard:{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9470DC] underline hover:text-primary transition-colors"
                >
                  supabase.com/dashboard
                </a>
              </li>
              <li>Select your project</li>
              <li>Go to the SQL Editor</li>
              <li>Create a new query</li>
              <li>
                Copy and paste the SQL from{" "}
                <code className="bg-muted px-2 py-1 rounded text-foreground font-mono text-sm">
                  /scripts/000_setup_all.sql
                </code>
              </li>
              <li>Click "Run" to execute</li>
              <li>Refresh this page</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              The SQL script will create all necessary tables and insert the
              initial data for all five women.
            </p>
          </div>
        ) : (
          <ProfileGrid women={women || []} />
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
