# 🏗️ Chrome (Host Application) — React + TypeScript + Module Federation + Rsbuild

This repository contains the **Chrome Host Application** in a **microfrontend architecture** built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Module Federation](https://module-federation.io/).
It serves as the **core container** for remote applications, handling authentication, shared UI components, and global logic.

---

## 🚀 Overview

The **Host App** is responsible for:

- 🔐 **User authentication** and session management
- 🧩 Providing **shared UI components** built with [shadcn/ui](https://ui.shadcn.com/)
- ⚙️ Exporting **common hooks** for:
  - Form handling — [react-hook-form](https://react-hook-form.com/)
  - Data fetching and mutations — [TanStack Query](https://tanstack.com/query/latest)
  - Schema validation — [Zod](https://zod.dev/)
- 🗺️ **Top-level routing** — controls navigation and route-based loading of remote apps
- 🧭 Rendering **global layout** elements: `Header`, `Sidebar`, and `Navbar`
- 🧠 Providing a **shared Redux store** accessible across all microfrontends
- 🌐 Exposing common modules for remote applications through **Module Federation**
- 🛠️ Built and bundled with [Rsbuild](https://modernjs.dev/rsbuild)

---

## 🧱 Tech Stack

| Category       | Technology                                          |
| -------------- | --------------------------------------------------- |
| Framework      | [React 18+](https://react.dev/)                     |
| Language       | [TypeScript](https://www.typescriptlang.org/)       |
| Bundler        | [Rsbuild](https://modernjs.dev/rsbuild)             |
| Microfrontends | [Module Federation](https://module-federation.io/)  |
| Forms          | [react-hook-form](https://react-hook-form.com/)     |
| Validation     | [Zod](https://zod.dev/)                             |
| Data Fetching  | [TanStack Query](https://tanstack.com/query/latest) |
| UI Library     | [shadcn/ui](https://ui.shadcn.com/)                 |

---

## ⚙️ Installation & Local Development

### 1. Clone the repository

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Before starting the app, you need to create a local environment file.
Copy the example file:

```bash
cp .env.example .env.local
```
Open .env.local and provide valid values for all keys (API endpoints, authentication URLs, etc.).

### 4. Start the development server
```bash
npm run dev
```

The app will be available at:
http://localhost:8080
