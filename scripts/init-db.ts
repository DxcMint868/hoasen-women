import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("[v0] Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initializeDatabase() {
  try {
    console.log("[v0] Starting database initialization...")

    // Create women_profiles table
    console.log("[v0] Creating women_profiles table...")
    const { error: profilesError } = await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS women_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          slack_pfp_url TEXT,
          password_hash TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        ALTER TABLE women_profiles ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow public read" ON women_profiles
          FOR SELECT USING (true);
      `,
    })

    if (profilesError) {
      console.log("[v0] Note: women_profiles table may already exist or RPC not available")
    } else {
      console.log("[v0] women_profiles table created successfully")
    }

    // Create redemptions table
    console.log("[v0] Creating redemptions table...")
    const { error: redemptionsError } = await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS redemptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          woman_id UUID NOT NULL REFERENCES women_profiles(id),
          wallet_address TEXT,
          phuc_long_code TEXT,
          usdt_claimed BOOLEAN DEFAULT FALSE,
          nft_claimed BOOLEAN DEFAULT FALSE,
          claimed_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        ALTER TABLE redemptions ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow public read" ON redemptions
          FOR SELECT USING (true);
      `,
    })

    if (redemptionsError) {
      console.log("[v0] Note: redemptions table may already exist")
    } else {
      console.log("[v0] redemptions table created successfully")
    }

    // Create messages table
    console.log("[v0] Creating messages table...")
    const { error: messagesError } = await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          woman_id UUID NOT NULL REFERENCES women_profiles(id),
          message_content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow public read" ON messages
          FOR SELECT USING (true);
      `,
    })

    if (messagesError) {
      console.log("[v0] Note: messages table may already exist")
    } else {
      console.log("[v0] messages table created successfully")
    }

    // Create feedback table
    console.log("[v0] Creating feedback table...")
    const { error: feedbackError } = await supabase.rpc("exec", {
      sql: `
        CREATE TABLE IF NOT EXISTS feedback (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          woman_id UUID NOT NULL REFERENCES women_profiles(id),
          feedback_type TEXT NOT NULL,
          content TEXT NOT NULL,
          is_anonymous BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT NOW()
        );
        
        ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow public read" ON feedback
          FOR SELECT USING (true);
      `,
    })

    if (feedbackError) {
      console.log("[v0] Note: feedback table may already exist")
    } else {
      console.log("[v0] feedback table created successfully")
    }

    console.log("[v0] Database initialization completed!")
  } catch (error) {
    console.error("[v0] Database initialization error:", error)
    process.exit(1)
  }
}

initializeDatabase()
