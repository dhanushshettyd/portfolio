# Dhanush Shetty. D — Developer Portfolio

Personal portfolio built with TanStack Start (React 19, SSR), Tailwind CSS, GSAP + Lenis, and a Spline 3D hero.
The contact form stores messages in Supabase; the GitHub section reads the public GitHub API.

## Run locally
```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

## Images
Place these in `public/images/`: `profile.jpeg`, `project-1.png`, `project-2.png`.

## Contact form
Run `supabase/contact_submissions.sql` in your Supabase project, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.

## Deploy (Vercel)
Import the repo, add the two environment variables above, deploy. Nitro detects Vercel automatically.

## GitHub activity section
Set `GITHUB_TOKEN` (a token with no scopes) to avoid GitHub API rate limits (HTTP 403) on the deployed site.
