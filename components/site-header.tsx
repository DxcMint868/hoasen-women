import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/20 bg-[#9470DC]/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo and watermark as a flex row */}
            <div className="flex items-center gap-3">
              <Image
                alt="Hoasen logo"
                src="/logo.png"
                width={160}
                height={160}
              />
              <span className="flex items-center gap-1">
                <span
                  className="text-xs font-semibold text-white/80 tracking-widest uppercase select-none"
                  style={{ letterSpacing: 2 }}
                >
                  Women
                </span>
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginLeft:2, verticalAlign:'middle'}}>
                  <circle cx="11" cy="11" r="10" fill="#F8BBD0" />
                  <path d="M11 7.5c2.2 0 4 1.5 4 3.5s-1.8 3.5-4 3.5-4-1.5-4-3.5 1.8-3.5 4-3.5z" fill="#C2185B" />
                  <path d="M11 7.5c1.2 0 2.2.7 2.2 1.7 0 1-1 1.8-2.2 1.8s-2.2-.8-2.2-1.8c0-1 .9-1.7 2.2-1.7z" fill="#F8BBD0" />
                  <path d="M11 15c-1.2 0-2.2.7-2.2 1.7" stroke="#388E3C" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M11 15c1.2 0 2.2.7 2.2 1.7" stroke="#388E3C" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </div>
          <p className="text-sm text-white/80 font-medium">
            Celebrating Vietnam Women's Day 20/10 • 2025
          </p>
        </div>
      </div>
    </header>
  );
}
