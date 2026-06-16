---
name: angular-v21-migration
description: >
  Rewrites legacy AngularJS (1.x) code into modern Angular v21 using Standalone Components,
  Signals, inject(), modern control flow (@if/@for/@switch), and HttpClient.
  Removes $scope, $http, $q, and NgModule patterns entirely.
  Use when the user asks to "migrate", "upgrade", "rewrite to Angular", or "modernize" any
  AngularJS component, service, controller, or directive.
execution:
  context: native
  timeout: 120
---

# AngularJS to Angular v21 Migration

Rewrite legacy AngularJS (1.x) code into modern Angular v21, applying current TypeScript
best practices and a fully reactive, signals-based architecture.

## Mandatory Architecture Rules

### 1. Standalone Components
- NEVER create or modify `app.module.ts` or use the `@NgModule` decorator.
- Every component must be Standalone: `standalone: true` inside the `@Component` decorator.
- Import dependencies directly in the component's `imports` array.

### 2. Dependency Injection
- Use the `inject()` function from `@angular/core` instead of constructor injection.
- Eliminate all `$inject` annotations and string-based DI from AngularJS.

### 3. Reactivity and State (Signals)
- Replace `$scope`, `$rootScope`, and `$watch` with Angular v21 **Signals**.
- Use `signal()` for mutable state, `computed()` for derived state, `effect()` for side effects.
- For component inputs use `input()` — **DO NOT** use `@Input()`.
- For component outputs use `output()` — **DO NOT** use `@Output()`.

### 4. Modern Control Flow (HTML Templates)
- NEVER use AngularJS directives: `ng-repeat`, `ng-if`, `ng-show`, `ng-hide`.
- NEVER use legacy Angular structural directives: `*ngIf`, `*ngFor`, `*ngSwitch`.
- ALWAYS use the new built-in control flow:
  - `@if (condition) { ... } @else { ... }`
  - `@for (item of items; track item.id) { ... }`
  - `@switch (value) { @case (x) { ... } }`

### 5. HTTP Communication
- Completely remove `$http` and `$q`.
- Use `HttpClient` from `@angular/common/http`.
- Convert legacy Promises to Observables or `async/await` depending on context.

## Workflow

### Step 1: Identify the Target
Ask (or infer from context) which file(s) need to be migrated:
- Controller → Component
- Service (`$http`-based) → Injectable Service with `HttpClient`
- Directive → Component or Attribute Directive
- Config/Route → Angular Router `Routes` array

### Step 2: Analyse the Legacy Code
Read the AngularJS file and identify:
- All `$scope` properties → become `signal()` or `computed()`
- All injected dependencies → become `inject()` calls
- All `$http` calls → become `HttpClient` methods
- All template directives → become modern control flow
- Any `$watch` / `$on` / `$broadcast` → become `effect()` or RxJS

### Step 3: Produce the Migrated Code
Output clean, refactored TypeScript and HTML files following the rules above.

**Component skeleton:**
```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [],
  templateUrl: './example.component.html',
})
export class ExampleComponent {
  private readonly http = inject(HttpClient);

  protected readonly items = signal<Item[]>([]);
  protected readonly isLoading = signal(false);
}
```

**Template skeleton:**
```html
@if (isLoading()) {
  <p>Loading…</p>
} @else {
  @for (item of items(); track item.id) {
    <div>{{ item.name }}</div>
  }
}
```

### Step 4: Explain Architectural Decisions
Briefly explain (1–2 short paragraphs) the major decisions made:
- How `$scope.x` became a Signal
- How `$http` was replaced with `HttpClient`
- Any dead code or unused injections removed

## Expected Output Format
1. The complete migrated `.ts` file
2. The complete migrated `.html` template
3. A brief explanation of the architectural decisions made
