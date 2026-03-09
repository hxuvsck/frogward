# FrogWard

**FrogWard** is a modern online clothing store platform designed for selling curated apparel locally.
The project focuses on a clean shopping experience, fast deployment, and scalable integrations for payment and order management.

---

## Overview

FrogWard enables customers to browse and purchase clothing products online while providing a simple system for managing products and orders.

The platform is designed with a lightweight frontend architecture and serverless deployment to allow rapid iteration and easy scaling.

Future versions will include payment integrations, admin product management, and order tracking.

---

## Tech Stack

- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **UI Components:** shadcn/ui
- **Styling:** TailwindCSS
- **Deployment:** Vercel

---

## Project Structure

```
frogward/
├── public/           # Static assets
├── src/
│   ├── components/   # UI components
│   ├── pages/        # Application pages
│   ├── hooks/        # Custom hooks
│   ├── lib/          # Utilities
│   └── main.tsx      # Application entry
│
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## Local Development

Clone the repository:

```
git clone https://github.com/hxuvsck/frogward.git
cd frogward
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Build for Production

```
npm run build
```

Preview production build:

```
npm run preview
```

---

## Deployment

This project is deployed using **Vercel**.

Every push to the `main` branch automatically triggers a new deployment.

---

## Future Roadmap

Planned features include:

- Product inventory management
- Admin dashboard
- qPay payment integration
- Order tracking system
- Customer authentication (OTP / social login)

---

## License

This project is currently private and maintained by the Biotain Solutions team.
