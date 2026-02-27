# Product Intelligence Dashboard

**🏆 Winner — Most Popular Project** (voted by all hackathon participants and viewers)

A product development intelligence tool that identifies customer preferences and market trends by analyzing customer feedback data alongside comparable SKUs from e-commerce marketplaces. It surfaces actionable insights that inform product development decisions — what features to add, improve, or remove.

## What It Does

1. **Customer Sentiment Analysis** — Ingests customer review data and breaks down sentiment by feature (sound quality, battery life, comfort, etc.)
2. **Competitive Benchmarking** — Compares your product's feature set against comparable SKUs to identify gaps and opportunities
3. **Feature Recommendations** — Generates prioritized add/improve/remove recommendations backed by customer mention frequency, sentiment scores, and cost-impact estimates
4. **Trend Visualization** — Interactive dashboard with peer comparison matrices, sentiment breakdowns, and priority filtering

## How It Works

Upload your data files (customer reviews, competitor SKU data, search ranking data) and the dashboard cross-references everything to produce:

- **Feature gap analysis** — what competitors have that you don't
- **Sentiment-weighted priorities** — not just what customers mention, but how they feel about it
- **Cost-impact estimates** — rough sizing for each recommendation
- **Confidence scores** — how statistically reliable each insight is

## Product Decisions & Tradeoffs

- **Client-side processing over backend API** — All data stays in the browser. No uploads to a server. This was deliberate for a hackathon setting where participants didn't want to share proprietary product data.
- **Mock data as default** — The dashboard loads with realistic sample data (wireless earbuds category) so evaluators could see the full experience immediately without needing to bring their own files.
- **Feature-level sentiment over product-level** — Most review tools give you a single sentiment score. This breaks it down per feature, which is what product managers actually need for roadmap decisions.
- **Visual priority matrix** — Instead of a ranked list, features are plotted by sentiment vs. mention frequency so PMs can see the quadrants (high mentions + negative sentiment = urgent fix).

## Stack

Next.js · TypeScript · Tailwind CSS · shadcn/ui · Recharts

## Run Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

*Built by [Hammad Jilani](https://github.com/jilanihammad) — hackathon project, 2025.*
