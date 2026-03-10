# FrogWard

FrogWard is a React + TypeScript storefront and admin demo for industrial workwear and safety products.

## Current Scope

Implemented in the current demo:

- Customer storefront with product list, product detail, cart, checkout, about, contact, and account pages
- Mock customer login via OTP and Facebook
- Mock admin login and admin dashboard
- Admin product management
- Admin customer and order viewing
- Admin-managed hero marketing banners with story pages
- Mongolian / English language switching
- Local persistence via Zustand `persist`
- Admin auto logout after 15 minutes of inactivity

## Important Demo Limitations

Not fully implemented yet:

- No real backend or database
- No real authentication provider
- No real OTP delivery or Facebook OAuth
- No payment gateway integration such as qPay
- No server-side order processing
- No shipment or delivery tracking integration
- No role-based API security
- No real file upload service; images are stored as local data URLs in browser storage
- No shared multi-user persistence; data is device/browser-local
- No audit log, analytics, or reporting backend
- No automated admin permission granularity beyond the simple mock admin role

Behavior to be aware of:

- Customer, product, order, cart, and banner data are mock/demo data stored in local browser storage
- Clearing browser storage resets most app state
- Admin session timeout is client-side inactivity handling, not server-enforced session invalidation

## Tech Stack

- Frontend: React + TypeScript
- Build tool: Vite
- UI: shadcn/ui
- Styling: Tailwind CSS
- State: Zustand
- Routing: React Router
- Testing: Vitest + Testing Library

## Project Structure

```text
frogward/
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

## Local Development

```bash
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Build and Test

```bash
npm test
npm run build
```

## Backend Handoff

For backend integration guidance and production-readiness notes, see:

- [docs/backend-integration-handoff.md](/home/khusln/biotain/frogward/docs/backend-integration-handoff.md)

## License

This project is private and maintained by the Biotain Solutions team.
