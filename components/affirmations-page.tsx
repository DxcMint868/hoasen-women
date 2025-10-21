"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

interface Affirmation {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export default function AffirmationsPage({ womanId }: { womanId: string }) {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAffirmations = async () => {
      try {
        const supabase = createClient();
        console.log("Fetching affirmations for woman_id:", womanId);
        
        const { data, error: err } = await supabase
          .from("affirmations")
          .select("*")
          .eq("woman_id", womanId)
          .order("created_at", { ascending: false });

        console.log("Supabase response:", { data, error: err });

        if (err) {
          console.error("Error fetching affirmations:", err);
          setError("Failed to load affirmations");
          return;
        }

        console.log("Affirmations received:", data);
        setAffirmations(data || []);
      } catch (err) {
        console.error("Error:", err);
        setError("An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffirmations();
  }, [womanId]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading affirmations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        {/* Debug Info - Remove after testing */}
        <p className="text-xs text-muted-foreground/40 mb-2">Debug: womanId={womanId}, affirmations count={affirmations.length}</p>
        <h2 className="text-3xl font-bold text-foreground mb-2">Affirmations</h2>
        <p className="text-muted-foreground">
          {affirmations.length === 0
            ? "No affirmations yet. Be the first to share one!"
            : `${affirmations.length} beautiful message${affirmations.length !== 1 ? "s" : ""} of love and support`}
        </p>
      </div>

      {/* Affirmations Grid */}
      {affirmations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {affirmations.map((aff, index) => (
            <motion.div
              key={aff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative p-6 rounded-2xl border-2 border-white/40 bg-gradient-to-br overflow-hidden hover:shadow-lg transition-all duration-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${
                    ["#F8BBD0", "#FFD54F", "#CE93D8", "#B2DFDB", "#FFAB91", "#A5D6A7"][
                      index % 6
                    ]
                  }15, white)`
                }}
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-20 pointer-events-none">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="24" cy="24" r="22" fill="#9470DC" />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative space-y-3">
                  {/* Affirmation Message */}
                  <p className="text-foreground font-light italic text-base leading-relaxed">
                    "{aff.message}"
                  </p>

                  {/* Sender Name */}
                  <div className="pt-3 border-t border-[#9470DC]/20">
                    <p className="text-sm font-medium text-[#9470DC]">
                      ✨ {aff.sender_name}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {new Date(aff.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💌</div>
          <p className="text-muted-foreground">
            No affirmations yet. Share one from the profile card to inspire!
          </p>
        </div>
      )}
    </div>
  );
}
