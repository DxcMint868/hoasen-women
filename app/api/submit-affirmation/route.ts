import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Creative anonymous names for mysterious affirmation senders
const ANONYMOUS_NAMES = [
  "A Handsome but Mysterious Guy",
  "A Secret Admirer",
  "An Enigmatic Soul",
  "A Whisper in the Wind",
  "A Shadow with Good Intentions",
  "Anonymous Angel",
  "A Random Stranger with Vibes",
  "Someone Who Gets It",
  "A Silent Cheerleader",
  "An Admirer of Excellence",
  "A Kind Anonymous Soul",
  "A Mysterious Wonderful Human",
  "Someone Who Believes in You",
  "A Devoted Fan in the Shadows",
  "An Invisible But Sincere Friend",
  "A Beautiful Stranger",
  "Someone with Good Juju",
  "An Honest Anonymous Admirer",
  "A Positive Anomaly",
  "Someone Who Sees Your Magic",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { womanId, senderName, message } = body;

    // Validate inputs
    if (!womanId || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { error: "Message is too long (max 500 characters)" },
        { status: 400 }
      );
    }

    // Use provided name or generate a mysterious one
    let finalSenderName = senderName?.trim();
    if (!finalSenderName) {
      finalSenderName =
        ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
    } else if (finalSenderName.length > 100) {
      return NextResponse.json(
        { error: "Name is too long (max 100 characters)" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Insert affirmation into database
    const { data, error } = await supabase
      .from("affirmations")
      .insert({
        woman_id: womanId,
        sender_name: finalSenderName,
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting affirmation:", error);
      return NextResponse.json(
        { error: "Failed to save affirmation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
