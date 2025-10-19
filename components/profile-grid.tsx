"use client"

import { useState } from "react"
import ProfileCard from "./profile-card"
import PasswordModal from "./password-modal"

interface Woman {
  id: string
  name: string
  slack_pfp_url: string
}

export default function ProfileGrid({ women }: { women: Woman[] }) {
  const [selectedWoman, setSelectedWoman] = useState<Woman | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleCardClick = (woman: Woman) => {
    setSelectedWoman(woman)
    setShowPasswordModal(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
        {women.map((woman) => (
          <ProfileCard key={woman.id} woman={woman} onClick={() => handleCardClick(woman)} />
        ))}
      </div>

      {selectedWoman && (
        <PasswordModal
          woman={selectedWoman}
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false)
            setSelectedWoman(null)
          }}
        />
      )}
    </>
  )
}
