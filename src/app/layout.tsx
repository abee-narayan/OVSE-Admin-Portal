import type { Metadata } from "next";
import "./globals.css";
import { MainNav } from "@/components/layout/main-nav";
import Image from "next/image";
import { JITElevationModal } from "@/components/admin/jit-elevation-modal";
import { UserAccountNav } from "@/components/layout/user-account-nav";

export const metadata: Metadata = {
  title: "OVSE Admin Portal",
  description: "UIDAI OVSE Administration and Approval Portal",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10">
                  <div className="absolute inset-0 bg-blue-600 rounded-sm italic font-bold text-white flex items-center justify-center">U</div>
                </div>
                <div>
                  <h1 className="text-xs font-semibold leading-tight text-slate-600">
                    Unique Identification Authority of India
                  </h1>
                  <p className="text-[10px] text-slate-400">Government of India</p>
                </div>
              </div>
              <MainNav />
            </div>
            <div className="flex items-center gap-4">
              <UserAccountNav />
              <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center p-1.5">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[8px] font-bold text-orange-600 uppercase">Aadhaar</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 h-1" />
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-8 px-4">
          {children}
        </main>
        <JITElevationModal />

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
            <div>
              <h3 className="text-lg font-bold mb-6">Contact Us</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/10 p-2 rounded">✉</div>
                <span>support-sandbox@uidai.net.in</span>
              </div>
              <h4 className="font-semibold mb-4 mt-8">Follow Us</h4>
              <div className="flex gap-4">
                {['Youtube', 'FB', 'X', 'Insta', 'In'].map(s => (
                  <div key={s} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
                    <span className="text-[8px] font-bold">{s.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">UIDAI Head Office</h3>
              <p className="opacity-80 leading-relaxed mb-4">
                Unique Identification Authority of India<br />
                Government of India (GoI)
              </p>
              <p className="opacity-80 leading-relaxed italic">
                Bangla Sahib Road, Behind Kali Mandir,<br />
                Gole Market, New Delhi - 110001
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Download Aadhaar App</h3>
              <div className="flex flex-col gap-4">
                <div className="bg-cyan-500/20 border border-cyan-400/30 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-cyan-500/30 transition-colors">
                  <div className="text-2xl">▶</div>
                  <div>
                    <p className="text-[10px] uppercase font-bold">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </div>
                <div className="bg-blue-500/20 border border-blue-400/30 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-500/30 transition-colors">
                  <div className="text-2xl"></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center opacity-60 text-xs">
            © 2026 Admin Portal - Unique Identification Authority of India. All Rights Reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
