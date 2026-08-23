# W3 Solution Craft Backend

This folder contains a production-ready Node.js + Express backend for W3 Solution Craft.

## Features
- User registration and login
- Email OTP verification
- JWT-based authentication
- Direct UPI Intent payment order creation and status verification
- Application submission after candidate processing fee initialization
- Supabase persistence for users, payments, and applications
- CORS configured for Vercel and local frontend deployments

## Prerequisites
- Node.js 18+
- A Supabase project
- Configured Company UPI ID (`COMPANY_UPI_ID`) and Name (`COMPANY_NAME`)

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
4. Run the Supabase SQL migrations in `supabase/migrations/`.
5. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables
See `.env.example` for the full list.

## API Summary
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `POST /api/payments/create-upi-order` (protected)
- `GET /api/payments/status/:transactionRef` (protected)
- `POST /api/applications/submit` (protected)
- `GET /api/applications/me` (protected)

## Deployment
Set the required environment variables in your hosting provider and point the frontend to the backend URL.
