"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AffirmationModalProps {
  womanId: string;
  womanName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AffirmationModal({
  womanId,
  womanName,
  isOpen,
  onClose,
  onSuccess,
}: AffirmationModalProps) {
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/submit-affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          womanId,
          senderName,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit affirmation");
        return;
      }

      setSuccess(true);
      setSenderName("");
      setMessage("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        onSuccess?.();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md bg-white border-2 border-white/50 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {success
              ? "✨ Affirmation Sent!"
              : `Send Affirmation to ${womanName}`}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Thank you for spreading positivity! Your affirmation will brighten
              their day.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Share a kind word or affirmation with {womanName}. Your message
              will be displayed on their redemption page.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <Label htmlFor="senderName" className="text-foreground">
                  Your Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="senderName"
                  type="text"
                  placeholder="Leave blank to stay mysterious..."
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  disabled={isLoading}
                  maxLength={100}
                  className="border-primary/30 focus:border-primary focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">
                  Your Affirmation
                </Label>
                <textarea
                  id="message"
                  placeholder="Write a kind message, affirmation, or appreciation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                  maxLength={500}
                  rows={4}
                  className="w-full px-3 py-2 border border-primary/30 rounded-md focus:border-primary focus:ring-primary focus:outline-none text-sm resize-none"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {message.length}/500
                </p>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-full bg-[#9470DC] hover:bg-[#7d5fc4] text-white"
              >
                {isLoading ? "Sending..." : "Send Affirmation"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
