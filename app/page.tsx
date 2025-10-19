import { createClient } from "@/lib/supabase/server"
import ProfileGrid from "@/components/profile-grid"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: women, error } = await supabase
    .from("women_profiles")
    .select("*")
    .order("created_at", { ascending: true })

  const isDatabaseNotInitialized = error?.message?.includes("Could not find the table")

  if (error) {
    console.error("Error fetching women profiles:", error)
  }

  return (
    <main className="min-h-screen bg-[#9470DC]">
      <header className="border-b border-[#d4a5f5]/30 bg-[#9470DC]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d4a5f5] flex items-center justify-center shadow-lg shadow-[#d4a5f5]/30">
                <span className="text-[#2d1b4e] font-bold text-lg">🌸</span>
              </div>
              <h1 className="text-2xl font-bold text-[#2d1b4e]">Hoasen</h1>
            </div>
            <p className="text-sm text-[#5a3d7a] font-medium">Women's Day Celebration 2024</p>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-[#2d1b4e] mb-4 text-balance tracking-normal">
            Celebrate the Women of Hoasen
          </h2>
          <p className="text-lg text-[#5a3d7a] max-w-2xl mx-auto text-balance font-light">
            On Vietnam's Women's Day, we honor the incredible women who drive innovation and excellence at Hoasen. Click
            on your card to unlock your special gift.
          </p>
        </div>

        {isDatabaseNotInitialized ? (
          <div className="max-w-2xl mx-auto bg-[#a88ce8]/40 border-2 border-[#d4a5f5]/50 rounded-3xl p-8 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-[#2d1b4e] mb-4">Database Setup Required</h3>
            <p className="text-[#5a3d7a] mb-4">
              The database tables need to be initialized. Please follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-[#5a3d7a] mb-6">
              <li>
                Go to your Supabase dashboard:{" "}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8b5fc7] underline hover:text-[#d4a5f5]"
                >
                  supabase.com/dashboard
                </a>
              </li>
              <li>Select your project</li>
              <li>Go to the SQL Editor</li>
              <li>Create a new query</li>
              <li>
                Copy and paste the SQL from{" "}
                <code className="bg-[#a88ce8]/50 px-2 py-1 rounded text-[#2d1b4e]">/scripts/000_setup_all.sql</code>
              </li>
              <li>Click "Run" to execute</li>
              <li>Refresh this page</li>
            </ol>
            <p className="text-sm text-[#5a3d7a]">
              The SQL script will create all necessary tables and insert the initial data for the three women.
            </p>
          </div>
        ) : (
          <ProfileGrid women={women || []} />
        )}
      </section>

      <footer className="border-t border-[#d4a5f5]/30 bg-[#9470DC]/50 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-sm text-[#5a3d7a]">Made with care for the women of Hoasen • October 20, 2024</p>
        </div>
      </footer>
    </main>
  )
}
