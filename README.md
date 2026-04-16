# KaviTools — Free Invoice Generator

Create professional PDF invoices in seconds. No signup required.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **PDF:** @react-pdf/renderer
- **Payments:** Stripe
- **Language:** TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file:

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://kavitools.vercel.app
```

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Business Model

- **Free:** 3 invoices/month (tracked via localStorage)
- **Pro:** $5/month unlimited (Stripe subscription)

## License

Proprietary — KaviTools
