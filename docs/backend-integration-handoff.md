# Backend Integration Handoff

## Purpose

This document is the backend handoff for the current FrogWard frontend.

Use this frontend as:

- a UI and behavior reference
- a field and workflow reference
- a draft data model reference

Do not use it as a final production contract without review. The current app is still a frontend-first demo with mock state and browser-local persistence.

## Current State

What is already solid enough to hand off:

- Customer storefront routes and flows exist
- Admin routes and CRUD-style screens exist
- Core TypeScript models exist for `User`, `Product`, `Order`, `CustomerRecord`, and `MarketingBanner`
- Cart, checkout, profile editing, order browsing, and marketing banner management have working frontend behavior
- The app now has deployment hardening for Vercel and client recovery for corrupted local state

What is still demo-only:

- Authentication is mocked
- OTP verification is mocked
- Facebook login is mocked
- Orders are created entirely in the browser
- Products, customers, banners, and orders are stored in Zustand + `localStorage`
- Admin authorization is enforced only in the client
- Images are not uploaded to a backend storage service

## Can You Give This To A Backend Engineer?

Yes, with the right expectation.

It is good enough for a backend engineer to start integration if they treat it as a frontend reference implementation, not as a finished production architecture.

It is not ideal to hand off without explanation because:

- there is no API layer yet
- the stores mix UI state and domain data state
- several flows still generate business data on the client
- some admin image flows still store base64 data in browser storage

## Recommended Backend Interpretation

The backend engineer should treat the current frontend in this order:

1. Route and screen intent
2. Required fields shown in forms
3. Status values and enums
4. Admin/customer workflow expectations
5. Only then the existing client-side store logic

The current store logic is useful for understanding behavior, but it should mostly be replaced by server-backed reads and writes.

## Core Models In Frontend

Reference files:

- [user.ts](/home/khusln/biotain/frogward/src/types/user.ts)
- [product.ts](/home/khusln/biotain/frogward/src/types/product.ts)
- [order.ts](/home/khusln/biotain/frogward/src/types/order.ts)
- [customer.ts](/home/khusln/biotain/frogward/src/types/customer.ts)
- [marketing-banner.ts](/home/khusln/biotain/frogward/src/types/marketing-banner.ts)

Important observations:

- `User` currently mixes auth identity, customer profile, and company profile fields
- `Order` currently stores denormalized customer fields directly on the order
- `Product.category` is a string enum-like id, not a normalized relation
- `Product` now supports optional bilingual fields: `nameEn`, `nameMn`, `descriptionEn`, `descriptionMn`
- `MarketingBanner.image` is currently just a string and should become a storage URL

## Existing Frontend Flows

### Auth

Reference:

- [auth-store.ts](/home/khusln/biotain/frogward/src/store/auth-store.ts)
- [Login.tsx](/home/khusln/biotain/frogward/src/pages/Login.tsx)
- [VerifyOtp.tsx](/home/khusln/biotain/frogward/src/pages/VerifyOtp.tsx)

Current behavior:

- phone number is entered on login page
- OTP page accepts only hardcoded `123456`
- admin login is inferred from phone number `99112233`
- Facebook login creates a mock customer instantly

Production recommendation:

- split auth from profile
- use server-issued session or token
- use HTTP-only cookies if web-first
- move OTP issue/verify fully server-side
- replace mock Facebook login with real OAuth or remove it until implemented
- never infer admin role from a phone number in the client

### Products

Reference:

- [product-store.ts](/home/khusln/biotain/frogward/src/store/product-store.ts)
- [AdminProducts.tsx](/home/khusln/biotain/frogward/src/pages/admin/AdminProducts.tsx)
- [AdminProductProfile.tsx](/home/khusln/biotain/frogward/src/pages/admin/AdminProductProfile.tsx)

Current behavior:

- products are created/updated/deleted in browser storage
- stock state is toggled in browser
- product content now supports English and Mongolian fields with fallback behavior
- product image upload still stores data URL in browser state

Production recommendation:

- move products to database-backed CRUD
- model localized product text explicitly instead of relying on a single `name` / `description`
- preserve frontend fallback behavior: if one locale is missing, use the other locale's value
- upload images to object storage and store only URLs in product records
- validate slug uniqueness server-side
- add product status/inventory fields beyond `inStock` if inventory matters
- treat category as a managed lookup table or a constrained enum

### Checkout and Orders

Reference:

- [Checkout.tsx](/home/khusln/biotain/frogward/src/pages/Checkout.tsx)
- [order-store.ts](/home/khusln/biotain/frogward/src/store/order-store.ts)

Current behavior:

- order ids are generated in browser
- order total is calculated in browser
- order is saved locally
- payment method selection is UI-only
- order starts as `awaiting_payment` with `paymentStatus: unpaid`

Production recommendation:

- server must calculate totals from authoritative product data
- server must create the order id
- stock validation must happen server-side at checkout
- payment initiation must be created server-side
- payment status updates should come from gateway callback/webhook
- order state transitions should be permission-checked and audited

### Customer Profile

Reference:

- [AccountProfile.tsx](/home/khusln/biotain/frogward/src/pages/AccountProfile.tsx)
- [customer-store.ts](/home/khusln/biotain/frogward/src/store/customer-store.ts)

Current behavior:

- frontend stores both personal and company profile fields locally
- validation is UI-side only

Production recommendation:

- separate customer account identity from profile details if possible
- validate required company fields server-side
- treat phone and email verification as backend-owned truth

### Marketing Banners

Reference:

- [AdminMarketing.tsx](/home/khusln/biotain/frogward/src/pages/admin/AdminMarketing.tsx)
- [marketing-store.ts](/home/khusln/biotain/frogward/src/store/marketing-store.ts)

Current behavior:

- banners are browser-local
- banner image upload is compressed client-side to avoid browser storage corruption
- story detail pages are rendered from banner content

Production recommendation:

- banner image should be uploaded to object storage
- banner records should live in database
- story/banner content should have server-managed publish state
- consider separate content model if marketing stories become richer than banner cards

## Production Gaps To Fix

These are the main gaps before calling the current app production-standard.

### High priority

- Replace all domain stores backed by `localStorage` with API-backed data
- Implement real authentication and authorization
- Move image handling to backend storage
- Add a real API client layer instead of direct store mutations
- Enforce admin access on backend, not only in React routes
- Replace client-created order ids and totals with server-created values

### Medium priority

- Add pagination/filtering contracts for admin lists
- Normalize category management
- Add validation schemas shared between frontend and backend if possible
- Add audit logging for admin edits
- Add proper payment integration lifecycle

### Lower priority but still worthwhile

- Internationalization source management outside a single large local store
- Server-side analytics and reporting
- Better distinction between draft/published marketing content

## Suggested API Surface

This is a reasonable first-pass backend contract.

### Auth

- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `POST /auth/logout`
- `GET /auth/session`
- `GET /auth/oauth/facebook/start`
- `GET /auth/oauth/facebook/callback`

### Customer

- `GET /me`
- `PATCH /me`
- `GET /me/orders`

### Products

- `GET /products`
- `GET /products/:slug`
- `POST /admin/products`
- `PATCH /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/products/:id/image`

### Orders

- `POST /orders`
- `GET /orders/:id`
- `GET /admin/orders`
- `PATCH /admin/orders/:id/status`

### Customers Admin

- `GET /admin/customers`
- `GET /admin/customers/:id`

### Marketing

- `GET /marketing/banners`
- `GET /marketing/stories/:slug`
- `POST /admin/marketing/banners`
- `PATCH /admin/marketing/banners/:id`
- `DELETE /admin/marketing/banners/:id`
- `POST /admin/marketing/banners/:id/image`

## Suggested Frontend Refactor For Integration

Best practice would be:

1. Keep Zustand only for UI state and lightweight session state
2. Move server data fetching/mutations to React Query
3. Create `src/api/` or `src/services/` for endpoint calls
4. Keep type definitions in `src/types/`, but align them with backend DTOs
5. Add mapper functions where backend models and frontend view models differ

In other words:

- `cart` can stay client-side until checkout
- `theme` and `lang` can stay local
- `auth`, `products`, `orders`, `customers`, and `marketing` should become server-backed

## Practical Integration Order

If a backend engineer wants the least painful integration path:

1. Implement auth/session endpoints
2. Implement products read APIs
3. Replace checkout/order creation with server order creation
4. Implement admin product CRUD
5. Implement admin order management
6. Implement customer profile persistence
7. Implement marketing/banner content and image upload

## Important Caveat

There is one remaining frontend pattern that should not survive into production:

- product image uploads in admin product screens still use in-browser data URLs

That should be replaced with proper upload endpoints and storage URLs before production.

## Bottom Line

This project has progressed far enough that a backend engineer can integrate against it now.

But the correct framing is:

- the frontend UX and data intent are already useful
- the production architecture is not finished
- the backend should not mirror the current browser-local persistence model

If you want a cleaner next step, the frontend should add a dedicated API layer before backend integration begins. That is the best-standard-practice move from the current state.
