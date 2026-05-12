# Reply Assistant — Setup Guide

## 1. Supabase (database for knowledge base)

1. Go to [supabase.com](https://supabase.com) and create a free account + new project.
2. Open the **SQL Editor** in your project and run this query to create the knowledge base table:

```sql
CREATE TABLE knowledge_base (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO knowledge_base (id, title) VALUES
  ('general',            'General Company Knowledge'),
  ('linkedin_investors', 'LinkedIn → Investors'),
  ('linkedin_colleges',  'LinkedIn → D1 Colleges'),
  ('linkedin_agencies',  'LinkedIn → Sports Agencies'),
  ('email_investors',    'Email → Investors'),
  ('email_athletes',     'Email → Athletes');
```

3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com) and create an API key.
2. Copy it → `ANTHROPIC_API_KEY`

## 3. Local setup

```bash
# Copy env file and fill in your keys
cp .env.local.example .env.local

# Install dependencies
npm install

# Run locally
npm run dev
# Open http://localhost:3000
```

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), import the repo.
3. In Vercel project settings → **Environment Variables**, add the 3 keys from `.env.local`.
4. Deploy — done. Share the Vercel URL with your team.

## Usage

- **Draft Reply tab**: Select a campaign, paste the conversation or upload a screenshot, click Generate.
- **Knowledge Base tab**: Fill in the General section (company info, CEO bio, Calendly link, deck link) and each campaign section (tone, what to push for). Save each section individually.
