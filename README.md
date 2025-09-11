# Basirah-RGS | Repair & Grading System

A web application for managing customer repairs and grading, built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

## Features

- Customer management dashboard
- Modal dialogs for customer details
- Data-driven components
- Supabase integration for authentication and data storage
- Responsive UI with Tailwind CSS

## Project Structure

```
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── CustomerManagement.tsx
│   │   ├── CustomerModal.tsx
│   │   ├── Dashboard.tsx
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── utils/
├── supabase/
│   └── migrations/
├── .bolt/
│   ├── config.json
│   ├── prompt
│   └── supabase_discarded_migrations/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```sh
npm install
```

### Development

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```sh
npm run build
```

### Lint

```sh
npm run lint
```

## Supabase Setup

- Configure your Supabase credentials in environment variables or config files.
- Run migrations from `supabase/migrations/` as needed.

## License

MIT
