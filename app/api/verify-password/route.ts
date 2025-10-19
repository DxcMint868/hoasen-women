import { createClient } from "@/lib/supabase/server";
import { verifyPassword } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { womanId, password } = await request.json();

    if (!womanId || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the woman's password hash
    const { data: woman, error } = await supabase
      .from("women_profiles")
      .select("password_hash")
      .eq("id", womanId)
      .single();

    if (error || !woman) {
      return NextResponse.json({ error: "Woman not found" }, { status: 404 });
    }

    // Verify password
    const isValid = await verifyPassword(password, woman.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
