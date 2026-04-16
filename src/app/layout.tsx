import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaviTools — Free Invoice Generator | Create Professional Invoices in Seconds",
  description:
    "Create professional PDF invoices in seconds. No signup required. Free for up to 3 invoices per month, unlimited with Pro at $5/mo. Perfect for freelancers and small businesses.",
  keywords: ["invoice generator", "free invoice", "PDF invoice", "invoice maker", "freelance invoice", "small business invoice", "online invoice generator"],
  metadataBase: new URL("https://kavitools.vercel.app"),
  openGraph: {
    title: "KaviTools — Free Invoice Generator",
    description: "Create professional PDF invoices in seconds. No signup, no account needed.",
    url: "https://kavitools.vercel.app",
    siteName: "KaviTools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KaviTools — Free Invoice Generator",
    description: "Create professional PDF invoices in seconds. No signup needed.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://kavitools.vercel.app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-brand-400">⚡</span> KaviTools
            </a>
            <div className="flex items-center gap-6">
              <a href="/#pricing" className="text-sm text-gray-400 hover:text-white transition">
                Pricing
              </a>
              <a
                href="/create"
                className="text-sm bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition"
              >
                Create Invoice
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-800 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} KaviTools. All rights reserved.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
