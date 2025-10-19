# Gift redemption website

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ducmint864s-projects/v0-gift-redemption-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/H9biQk1SPlk)

## Overview

This is a Next.js web application for a "Hoasen Women's Day 2024" gift redemption program. It allows users to view profiles of women being celebrated and redeem gifts. The application uses Supabase for its database and is deployed on Vercel.

## Key Technologies

*   **Framework:** Next.js
*   **Database:** Supabase (PostgreSQL)
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel

## Architecture

The application is structured as a standard Next.js project:

*   `app/`: Contains the main application pages and API routes.
    *   `app/page.tsx`: The homepage that displays a grid of women's profiles.
    *   `app/redeem/[id]/page.tsx`: The page for redeeming a gift.
    *   `app/admin/`: Contains pages for the admin dashboard and login.
    *   `app/api/`: Contains API routes for handling actions like claiming rewards and verifying passwords.
*   `components/`: Contains reusable React components.
*   `lib/`: Contains utility functions, including Supabase client initialization and authentication logic.
*   `scripts/`: Contains SQL scripts for database setup.
*   `public/`: Contains static assets like images.

## Building and Running

### Prerequisites

*   Node.js and pnpm
*   Supabase account and project

### Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following environment variables:

    ```
    SUPABASE_URL=<your-supabase-project-url>
    SUPABASE_ANON_KEY=<your-supabase-anon-key>
    ```

3.  **Set up the database:**
    *   Go to your Supabase project's SQL Editor.
    *   Copy and paste the content of `scripts/000_setup_all.sql` into a new query.
    *   Run the query to create the necessary tables and insert initial data.

### Running the application

To run the application in development mode, use the following command:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building for production

To build the application for production, use the following command:

```bash
pnpm build
```

### Linting

To run the linter, use the following command:

```bash
pnpm lint
```

## Development Conventions

*   **Coding Style:** The project uses TypeScript and follows standard React and Next.js conventions.
*   **Database:** The database schema is managed through SQL scripts in the `scripts/` directory.
*   **Authentication:** The application uses Supabase for authentication.
*   **API:** API routes are defined in the `app/api/` directory.
