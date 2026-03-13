# My Reading List

A personal book portfolio website to showcase books you've read with reviews.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add environment variables
Create a `.env.local` file in the root:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_chosen_password
```

### 3. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Admin panel
Go to `/admin` and enter your password to add/edit books.

## Deploying to Vercel
Add the three environment variables above in Vercel project settings, then deploy.
