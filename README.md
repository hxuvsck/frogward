# FrogWard

FrogWard is a React + TypeScript storefront and admin demo for industrial workwear and safety products. It includes a customer-facing shopping flow, a mock authentication experience, and an admin area for managing products, customers, orders, and homepage marketing content.

## Highlights

- Storefront pages for home, products, product detail, cart, checkout, about, contact, and account
- Mock login flow with phone OTP and Facebook sign-in
- Admin dashboard plus product, customer, order, and marketing management screens
- Mongolian and English localization
- Browser-persisted demo state using Zustand `persist`
- Client-side admin auto logout after 15 minutes of inactivity
- Unit and component tests with Vitest and Testing Library

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Vitest

## Demo Behavior

This project is a frontend demo. App data is stored in browser local storage rather than a backend.

- Products, cart, customers, orders, categories, and marketing banners are persisted per browser
- Clearing browser storage resets the demo state
- Admin session timeout is enforced on the client only
- Image uploads are stored as local data URLs in browser storage

### Demo Sign-In

- Admin phone: `99112233`
- Demo OTP: `123456`
- Any other phone number signs in as a customer
- Facebook sign-in creates a separate mock customer profile

## Current Scope

### Customer experience

- Browse products by category
- View product detail pages
- Add items to cart and proceed through checkout
- Read marketing story pages from homepage banners
- View account overview, profile, and order history

### Admin experience

- View dashboard summary
- Create, edit, and delete products
- View customers and customer profiles
- View orders and order detail pages
- Manage homepage marketing banners

## Known Limitations

- No real backend, database, or API integration
- No real OTP delivery or Facebook OAuth provider
- No payment gateway integration
- No server-side order processing
- No shipment or delivery tracking
- No role-based API authorization
- No multi-user shared persistence
- No analytics, audit logs, or reporting backend

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run build:dev
npm run preview
npm run lint
npm test
npm run test:watch
```

## Project Structure

```text
frogward/
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── store/
│   ├── test/
│   └── types/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## Testing

Run the test suite with:

```bash
npm test
```

## License

This project is private and maintained by the Biotain Solutions team.
