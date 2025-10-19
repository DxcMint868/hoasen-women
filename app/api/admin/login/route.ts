import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Admin password hash (in production, this should be in environment variables)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "admin123"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    // Simple password verification (in production, use bcrypt)
    if (password !== ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Generate a simple token (in production, use JWT)
    const token = crypto.randomBytes(32).toString("hex")

    return NextResponse.json({ success: true, token })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
