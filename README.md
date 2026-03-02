# Product Intelligence Dashboard

**Winner, Most Popular Project** (voted by all hackathon participants and viewers)

Analyzes customer feedback data alongside comparable SKUs from e-commerce marketplaces. Surfaces feature-level recommendations: what to add, improve, or remove, backed by sentiment scores and mention frequency.

## What It Does

1. **Customer Sentiment Analysis.** Ingests customer reviews and breaks down sentiment by feature (sound quality, battery life, comfort, etc.)
2. **Competitive Benchmarking.** Compares your product's feature set against comparable SKUs to identify gaps and opportunities.
3. **Feature Recommendations.** Prioritized add/improve/remove recommendations backed by mention frequency, sentiment scores, and cost-impact estimates.
4. **Trend Visualization.** Interactive dashboard with peer comparison matrices, sentiment breakdowns, and priority filtering.

## How It Works

Upload data files (customer reviews, competitor SKU data, search ranking data) and the dashboard cross-references everything to produce:

- Feature gap analysis: what competitors have that you don't
- Sentiment-weighted priorities: not just what customers mention, but how they feel about it
- Cost-impact estimates for each recommendation
- Confidence scores for statistical reliability

All processing happens client-side. No data leaves the browser.

The dashboard loads with realistic sample data (wireless earbuds category) so you can see the full experience without bringing your own files.

## Stack

Next.js · TypeScript · Tailwind CSS · shadcn/ui · Recharts

## Run Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT
