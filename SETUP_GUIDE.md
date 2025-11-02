# Setup Guide - Fixing Supabase Configuration Error

## The Error

If you see this error:
```
Error: Your project's URL and Key are required to create a Supabase client!
```

This means your Supabase environment variables are not configured properly.

## Solution

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details
5. Wait 2-3 minutes for the project to be ready

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

### Step 3: Update .env.local

Edit the `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy the contents of `supabase/schema.sql` from this project
4. Paste and run the SQL

### Step 6: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add these URLs:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** `http://localhost:3000/auth/callback`

### Step 7: Start the Application

```bash
npm run dev
```

The application should now start on [http://localhost:3000](http://localhost:3000)

## Troubleshooting

### Error persists after setting environment variables

- Make sure you **restart your development server** after changing `.env.local`
- Verify that your environment variables don't have any extra spaces or quotes
- Check that you copied the full anon key (it's very long)

### Build fails

- Make sure all dependencies are installed: `npm install`
- Try deleting `.next` folder and rebuilding: `rm -rf .next && npm run dev`

### Database errors

- Make sure you ran the `supabase/schema.sql` script in your Supabase dashboard
- Check that Row Level Security (RLS) policies are enabled (the schema should set this up automatically)

## Need Help?

Check the main README.md for more detailed documentation and feature descriptions.
