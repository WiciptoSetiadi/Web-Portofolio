# Modern Portfolio System

A high-performance, production-ready portfolio and CMS built with:
- Vanilla JS (No Framework Overhead)
- Vite build system
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Storage)
- Clean Architecture

## Features
- **Public Portfolio**: Fast, SEO friendly, dynamic content loading.
- **Admin Dashboard**: Secure RBAC dashboard to manage all content without code changes.
- **Dynamic Content**: Keyed CMS system for section text/configs.

## Setup Instructions
1. Copy `.env.example` to `.env` and fill in Supabase credentials.
2. Run `database/schema.sql` in your Supabase SQL Editor to build the database, RLS, and seed data.
3. Run `npm install`
4. Run `npm run dev` to start locally.
5. Access Admin at `/admin` (Default first user signup gets admin role).

## Deployment
Configured for Vercel out of the box (`vercel.json`).
