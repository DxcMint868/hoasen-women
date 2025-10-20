'use client';

import { useEffect, useState } from "react";

const meetingTypes = [
  "All hands meeting",
  "Daily tech standup",
  "Backlog refinement",
  "Task grooming",
  "Sprint planning",
  "Retrospective",
  "1:1 catchup",
  "Demo day",
  "Release party",
  "Code review",
  "Design critique",
  "Lunch break (optional)",
];

export default function AnimatedMeetingHeadline() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % meetingTypes.length);
    }, 900); // Fast speed
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="mt-2 text-base font-semibold flex items-center justify-center gap-2">
      <span className="px-2 py-1 rounded text-[#FFD54F] bg-[#fff]/20 transition-all duration-300" style={{minWidth:120, display:'inline-block'}}>
        {meetingTypes[idx]}
      </span>
      <span className="text-white/80">in 5 minutes</span>
    </div>
  );
}
