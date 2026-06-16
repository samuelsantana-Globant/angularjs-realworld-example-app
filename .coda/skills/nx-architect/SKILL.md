---
name: nx-architect
description: >
  Manages an Nx monorepo containing a modern Angular v21 app (modern-app) and a legacy
  AngularJS app (legacy-app) running simultaneously via the Strangler Fig routing pattern.
  Handles proxy configuration, Nx CLI commands, project.json setup, and safe coexistence
  of both apps during incremental migration.
  Use when the user asks to "set up Nx", "configure the monorepo", "add proxy routing",
  "generate a library", or "run Nx tasks" in a migration context.
execution:
  context: native
  timeout: 120
---

# Nx Monorepo & Migration Architect

Manage a dual-app Nx workspace where a modern Angular v21 app progressively replaces a
legacy AngularJS app using the Strangler Fig pattern — routing migrated routes to the new
app and falling back to the legacy app for everything else.

## Mandatory Rules

### 1. Workspace Configuration
- ALWAYS interact with `project.json` or `nx.json`. Do NOT assume `angular.json` exists.
- Use Nx executors for build and serve targets:
  - `@nx/angular:webpack-browser` for legacy builds
  - `@nx/angular:application` for modern Angular v21 apps
- Never manually edit `node_modules` or generated cache files.

### 2. Strangler Fig Proxy Routing
- `modern-app` (port 4200) intercepts all routes first.
- Any route NOT yet migrated is forwarded transparently via `proxy.conf.json` to `legacy-app` (port 4201).
- When a route is fully migrated, remove its proxy entry.

**proxy.conf.json pattern:**
```json
{
  "/legacy-route": {
    "target": "http://localhost:4201",
    "secure": false,
    "changeOrigin": true
  }
}
```

### 3. Command Generation
- ALWAYS use Nx CLI — never the standard Angular CLI (`ng`):
  - Generate: `npx nx g @nx/angular:component ...`
  - Run: `npx nx run modern-app:serve`
  - Build: `npx nx run modern-app:build`
- Create Standalone libraries for shared UI or domain logic:
  ```bash
  npx nx g @nx/angular:library shared-ui --standalone
  ```

### 4. Safety & Legacy
- Treat `legacy-app` as a black box — do not break its build configuration.
- Only modify `legacy-app`'s `project.json` when strictly necessary (e.g., changing its serve port to 4201).
- All new features go into `modern-app` or shared libraries.

## Workflow

### Step 1: Assess the Current State
Read `nx.json` and both `project.json` files to understand:
- Current serve ports for both apps
- Existing proxy configuration
- Shared libraries already present in the workspace

### Step 2: Identify the Task
Determine what the user needs:
- **New route migration** → add component to `modern-app`, remove proxy entry
- **New shared library** → generate with `@nx/angular:library`
- **Proxy update** → edit `proxy.conf.json`
- **New Nx target** → edit `project.json` executor config

### Step 3: Produce Configuration or Commands
Output the exact JSON configuration changes and/or Nx CLI commands needed.

**project.json serve target example:**
```json
{
  "serve": {
    "executor": "@nx/angular:dev-server",
    "options": {
      "port": 4200,
      "proxyConfig": "apps/modern-app/proxy.conf.json"
    }
  }
}
```

### Step 4: Explain the Impact
Briefly explain:
- Which routes are now handled by `modern-app` vs `legacy-app`
- Any risk to the legacy app's build or runtime
- Whether a restart of either dev server is required

## Expected Output Format
1. Exact JSON configuration changes for `project.json`, `nx.json`, or `proxy.conf.json`
2. Exact Nx CLI commands to execute (copy-paste ready)
3. A brief explanation of the proxy/routing changes and their impact
