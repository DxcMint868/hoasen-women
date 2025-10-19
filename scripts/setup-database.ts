import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing Supabase environment variables. Please set SUPABASE_NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log("Starting database setup...");

    // Read and execute SQL files
    const fs = await import("fs");
    const path = await import("path");

    const sqlFiles = [
      "001_create_women_profiles.sql",
      "002_create_redemptions.sql",
      "003_create_messages.sql",
      "004_create_feedback.sql",
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(process.cwd(), "scripts", file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Executing ${file}...`);

      // Split by semicolon and execute each statement
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (const statement of statements) {
        const { error } = await supabase.rpc("exec", { sql: statement });
        if (error) {
          console.error(`Error executing statement in ${file}:`, error);
        }
      }

      console.log(`✓ ${file} completed`);
    }

    console.log("✓ Database setup completed successfully!");
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
