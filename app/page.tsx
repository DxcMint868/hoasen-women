import { createClient } from "@/lib/supabase/server";
import ProfileGrid from "@/components/profile-grid";
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
    <main className="min-h-screen bg-[#9470DC]">
      <SiteHeader />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-4 text-balance tracking-normal">
            Honor the Women of Hoasen
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto text-balance font-light">
            On Vietnam's Women's Day, we tribute the incredible women who drive
            innovation and excellence at Hoasen. Click on your card to unlock
            your special gift.
          </p>
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
              initial data for the three women.
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
