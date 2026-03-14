# ApplyWise

A full-stack job application tracker with social features, built as a portfolio project to demonstrate end-to-end development skills.

**Live Demo:** _(add your deployment URL here)_

---

## Tech Stack

- **Framework:** Next.js 16 + TypeScript (strict)
- **Backend/Auth/Storage:** Appwrite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS + Radix UI + shadcn/ui
- **Charts:** Recharts
- **Animations:** GSAP

---

## Features

- **Application tracking** — Create, update, and delete job applications with status tracking and notes
- **File management** — Attach resumes, cover letters, and other documents per application
- **Application stats** — Visual pie charts breaking down your application pipeline
- **Social system** — Send and accept friend requests, view friends' stats
- **Auth flows** — Email/password login, registration, and password recovery

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Appwrite project credentials (see `.env.example` for details).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Credentials

```
Email:    demo@applywise.app
Password: demo1234
```

---

## Environment Variables

See `.env.example` for the full list of required variables and descriptions.
