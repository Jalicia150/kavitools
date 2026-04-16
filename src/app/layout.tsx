import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KaviTools — Free Invoice Generator",
  description:
    "Create professional invoices in seconds. Free to use, no signup required.",
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
      </body>
    </html>
  );
}
