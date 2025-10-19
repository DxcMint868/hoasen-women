import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hoasen Women's Day 2024 - Gift Redemption",
  description: "Celebrate Vietnam's Women's Day with Hoasen. Redeem your special digital and physical gifts.",
  generator: "v0.app",
  openGraph: {
    title: "Hoasen Women's Day 2024",
    description: "Celebrate Vietnam's Women's Day with Hoasen. Redeem your special digital and physical gifts.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
