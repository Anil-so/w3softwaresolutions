# W3 Solution Craft Backend

This folder contains a production-ready Node.js + Express backend for the W3 Solution Craft React + Vite project.

## Features
- User registration and login
- Email OTP verification
- JWT-based authentication
- Razorpay order creation and verification
- Application submission after successful payment verification
- Supabase persistence for users, payments, and applications
- CORS configured for Vercel frontend deployments

## Prerequisites
- Node.js 18+
- A Supabase project
- A Razorpay account
- SMTP credentials for OTP email delivery (optional in development)

## Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
3. Fill in the required environment variables in `.env`.
4. Create the Supabase tables using the SQL schema in `docs/supabase-schema.sql`.
5. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables
See `.env.example` for the full list.

## Supabase Setup
Run the SQL commands from `docs/supabase-schema.sql` in your Supabase SQL editor.

## API Summary
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `POST /api/payments/create-order` (protected)
- `POST /api/payments/verify` (protected)
- `POST /api/applications/submit` (protected)
- `GET /api/applications/me` (protected)

## Deployment
Set the same environment variables in your hosting provider and point the frontend to the backend URL.
