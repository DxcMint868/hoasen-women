"use client";

import { useState } from "react";
import ProfileCard from "./profile-card";
import PasswordModal from "./password-modal";
import FlipCard from "./men-card";
import NotListedWomanCard from "./not-listed-woman-card";

interface Woman {
  id: string;
  name: string;
  slack_pfp_url: string;
}

export default function ProfileGrid({ women }: { women: Woman[] }) {
  const [selectedWoman, setSelectedWoman] = useState<Woman | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleCardClick = (woman: Woman) => {
    setSelectedWoman(woman);
    setShowPasswordModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
        {women.map((woman) => (
          <ProfileCard
            key={woman.id}
            woman={woman}
            onClick={() => handleCardClick(woman)}
          />
        ))}
        {/* Funny MenCard at the end */}
        <div>
          <FlipCard
            frontText="For Hoasen men"
            backText="Sorry, this card is for decoration only. Try again on International Men's Day!"
          />
        </div>
        {/* Not Listed Woman Card at the end */}
        <div>
          <NotListedWomanCard />
          {/* <FlipCard
            frontText="Not listed?"
            backText="Become a part of hoasen! "
          /> */}
        </div>
      </div>

      {selectedWoman && (
        <PasswordModal
          woman={selectedWoman}
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedWoman(null);
          }}
        />
      )}
    </>
  );
}
