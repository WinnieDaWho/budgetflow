# BudgetFlow

A professional budget tracking application built with React, TypeScript, Vite, and Supabase.

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **UI Library:** shadcn/ui + Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Styling:** Professional "Bank-Grade" design with Slate/Blue palette

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Set up the database:**
   - Run the SQL schema from `schema.sql` in your Supabase SQL editor
   - This creates the `transactions` table with Row Level Security policies

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

- `src/pages/Dashboard.tsx` - Main dashboard page with transaction display
- `src/lib/supabase.ts` - Supabase client configuration
- `src/components/ui/` - shadcn/ui components (Button, Card, Table)
- `src/lib/utils.ts` - Utility functions (cn helper)

## Features

- View all transactions from Supabase
- Summary cards showing balance, income, and expenses
- Professional bank-grade UI design
- Responsive layout
- Type-safe with TypeScript
