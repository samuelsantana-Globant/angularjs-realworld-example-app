# Changelog

All notable changes to this project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v2.0.0] - 2026-06-18

### Breaking Changes
- wire app root component, routes and DI config (modern/shell) (f85a55f) -- NgModule pattern removed; app shell is fully Angular 21 standalone
- add Angular 21 core layer (modern/core) (5b26f68) -- replaces legacy $http/$q with standalone HttpClient + signals

### Features
- add all page components -- home, auth, article, editor, settings, profile (modern/features) (fb35faa)
- add reusable standalone UI components (modern/shared) (0c1c59b)
- add standalone Header and Footer components (modern/layout) (7f10d2c)
- add Angular 21 core layer -- models, services, auth interceptor (modern/core) (5b26f68)

---

## [v1.0.0] - 2026-06-17

### ✨ Features
- add Docker Compose and Nginx Strangler Fig reverse proxy (infra) (f3a82fe)
- scaffold shared Nx libraries for design tokens, API contracts, and UI (shared) (72e461e)
- scaffold Angular 21 standalone app in apps/modern (modern) (beccb4d)
- add vitest-clean-code skill (skills) (075c0e5)
- add nx-architect skill (skills) (a185b52)
- add css-to-tailwind skill (skills) (40dbd36)
- add angular-v21-migration skill (skills) (bfca5ce)
- add angular-commits skill definition (skills) (bb32b66)

### 🐛 Bug Fixes
- update modern upstream to use port 80 (proxy) (1ed8e71)
- fix healthchecks and expose app ports to host (docker) (e0f6d1c)
- standardize nginx to listen on port 80 (modern) (82af64c)
- disable BrowserSync browser auto-open in container (legacy) (d3fe5d7)
- fix error for undefined listConfig (4681508)
