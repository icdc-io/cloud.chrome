# 🏗️ Host Application — React + TypeScript + Module Federation + Rsbuild

This repository contains the **Host Application** in a **microfrontend architecture** built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Module Federation](https://module-federation.io/).
It serves as the **core container** for remote applications, handling authentication, shared UI components, and global logic.

---

## 🚀 Overview

The **Host App** is responsible for:

- 🔐 **User authentication** and session management
- 🧩 Providing **shared UI components** (built with [shadcn/ui](https://ui.shadcn.com/))
- ⚙️ Exporting **common hooks** for:
  - Form handling — powered by [react-hook-form](https://react-hook-form.com/)
  - Data fetching and mutations — via [TanStack Query](https://tanstack.com/query/latest)
  - Schema validation — using [Zod](https://zod.dev/)
- 🌐 Exposing modules for remote apps using **Module Federation**
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

```bash
npm install
npm run dev
```

The app will be available at:
http://localhost:8080
