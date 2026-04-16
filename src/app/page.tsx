export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-brand-950 text-brand-300 border border-brand-800">
            100% Free — No signup required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Professional Invoices
            <br />
            in Seconds
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Create, customize, and download beautiful PDF invoices. No account
            needed. Free for up to 3 invoices per month.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/create"
              className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg text-lg font-medium transition shadow-lg shadow-brand-600/25"
            >
              Create Free Invoice →
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📄",
                title: "PDF Download",
                desc: "Generate clean, professional PDF invoices ready to send to clients.",
              },
              {
                icon: "⚡",
                title: "Instant Creation",
                desc: "No signup, no login. Fill in the details and download immediately.",
              },
              {
                icon: "🎨",
                title: "Professional Design",
                desc: "Clean, modern invoice layout that makes your business look great.",
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Create invoices from any device — phone, tablet, or desktop.",
              },
              {
                icon: "🔒",
                title: "Privacy First",
                desc: "Your data stays in your browser. We don't store anything on our servers.",
              },
              {
                icon: "♾️",
                title: "Unlimited (Pro)",
                desc: "Need more than 3 per month? Go Pro for unlimited invoices at $5/mo.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-brand-800 transition"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Simple Pricing
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <div className="text-4xl font-bold mb-1">$0</div>
              <p className="text-gray-500 text-sm mb-6">Forever free</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> 3 invoices per month
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> PDF download
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Professional templates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> No signup required
                </li>
              </ul>
              <a
                href="/create"
                className="block text-center border border-gray-700 hover:border-gray-500 text-white px-6 py-2.5 rounded-lg transition w-full"
              >
                Get Started
              </a>
            </div>

            {/* Pro */}
            <div className="bg-gray-900 border-2 border-brand-600 rounded-xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <h3 className="text-lg font-semibold mb-1">Pro</h3>
              <div className="text-4xl font-bold mb-1">$5</div>
              <p className="text-gray-500 text-sm mb-6">per month</p>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Unlimited invoices
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> PDF download
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Professional templates
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Priority support
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Custom branding
                </li>
              </ul>
              <a
                href="/api/checkout"
                className="block text-center bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg transition w-full shadow-lg shadow-brand-600/25"
              >
                Upgrade to Pro →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get paid?</h2>
          <p className="text-gray-400 mb-8">
            Create your first invoice in under 60 seconds.
          </p>
          <a
            href="/create"
            className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-lg text-lg font-medium transition shadow-lg shadow-brand-600/25"
          >
            Create Free Invoice →
          </a>
        </div>
      </section>
    </div>
  );
}
