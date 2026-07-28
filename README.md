
# 🍽️ Smart Restaurant Management & Live Ordering System

A modern, interactive end-to-end restaurant management platform built with **Next.js** and **Firebase**. It allows customers to scan table-level QR codes to place live orders, while staff manage real-time kitchen tickets and menus from a centralized admin dashboard.

---

## 🌟 Key Features

### 📱 Customer Portal (Dine-In)
* **Table QR Binding:** Instant table identification via QR code parameters without downloading an app.
* **Interactive Menu:** Browse categories, view item details, filter choices, and build a custom order cart.
* **Seamless Checkout:** Real-time order placement synced instantly with the kitchen dashboard.

### 👨‍🍳 Admin & Kitchen Dashboard
* **Live Order Tickets:** Real-time sync for kitchen staff to receive, track, and update order statuses.
* **Menu Management:** Dynamically add, edit, or remove menu items, prices, and availability on the fly.
* **Protected Routes:** Secure PIN/auth setup and role-based access control for administrative actions.

---

## PROJECT STRUCTURE 

smart-restaurant-app/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── admin/            # Admin dashboard and menu management pages
│   ├── globals.css       # Global styling & Tailwind directives
│   ├── layout.tsx        # Root layout wrapper
│   └── page.tsx          # Homepage / Menu experience
├── components/           # Reusable UI components (cart, order cards, layout)
├── lib/                  # Helper utilities and Firebase database client
├── public/               # Static assets & icons
├── package.json          # Dependencies and scripts
└── next.config.ts        # Next.js build configuration

---

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (React, App Router, Turbopack)
* **Styling & UI:** Tailwind CSS, Lucide Icons, Radix UI / Shadcn
* **Backend & Database:** Firebase (Firestore / Realtime Database & Auth)
* **Deployment:** [Vercel](https://vercel.com/)

---
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🤝 Contributors
Dishakg1819

srishantdhongade39-beep


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

### How to update it:
1. Open **`README.md`** in VS Code.
2. Select all (`Ctrl + A`) and replace everything with the block above.
3. Save (`Ctrl + S`), commit, and push to GitHub:
   ```bash
   git add README.md
   git commit -m "Update README with project details and Next.js guides"
   git push origin main

---
   
## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
