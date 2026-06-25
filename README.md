<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/da794590-7a3e-4c94-a1fa-26e89d1e68b5

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Vercel deployment through GitHub

This is a Vite frontend, so production frontend values must be available when Vercel runs `npm run build`.

This repo includes `.env.production` with the frontend-safe Supabase values Vercel needs during the build:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the Supabase project base URL, for example `https://your-project-ref.supabase.co`, not the `/rest/v1/` endpoint.

Do not commit private server-only secrets such as `GEMINI_API_KEY`. Add private secrets in the deployment platform instead.
