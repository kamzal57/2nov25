# 2nov25

## Supabase Configuration

This project uses Supabase for authentication and backend services.

### Setup Instructions

1. **Get your Supabase credentials:**
   - Go to your Supabase project dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Navigate to: Settings → API
   - Copy your Project URL and anon/public key

2. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and replace the placeholder values with your actual Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project's anonymous/public key

Both values can be found in your Supabase project's API settings:
https://supabase.com/dashboard/project/_/settings/api

### Troubleshooting

If you see an error like "Your project's URL and Key are required to create a Supabase client!", it means:
- Your `.env.local` file is missing or not properly configured
- The environment variables are not set correctly
- Make sure you've copied `.env.example` to `.env.local` and filled in your actual Supabase credentials
