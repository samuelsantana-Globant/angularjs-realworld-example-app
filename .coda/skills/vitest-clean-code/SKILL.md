---
name: vitest-clean-code
description: >
  Reviews migrated Angular v21 TypeScript code for Clean Code compliance and writes fast,
  reliable unit tests using Vitest. Enforces single responsibility, guard clauses, descriptive
  naming, no magic values, and proper TestBed setup for Standalone Components with Signals.
  Use when the user asks to "write tests", "add unit tests", "review code quality",
  "apply clean code", or "check for code smells" in Angular v21 files.
execution:
  context: native
  timeout: 120
---

# Clean Code & Vitest Testing

Review migrated Angular v21 TypeScript code for Clean Code violations and produce
blazing-fast, reliable unit tests using Vitest with Angular TestBed.

## Mandatory Clean Code Rules

### 1. Readability First
- Use highly descriptive variable and function names — no obscure abbreviations.
- Boolean variables must read as questions: `isLoading`, `hasError`, `canSubmit`.
- Functions should express intent: `fetchUserProfile()` not `getData()`.

### 2. Single Responsibility & Complexity
- Functions must do exactly one thing.
- If a method handles multiple operations (formatting + API call), break it into private helpers.
- Avoid deep nesting — use **Guard Clauses** (early returns) to handle errors/edge cases first:
  ```typescript
  // ❌ Bad
  if (user) {
    if (user.isActive) { ... }
  }

  // ✅ Good
  if (!user) return;
  if (!user.isActive) return;
  ```

### 3. No Magic Values
- Extract hardcoded numbers or strings into `readonly` properties, `const` declarations, or `enum`:
  ```typescript
  // ❌ Bad
  if (status === 401) { ... }

  // ✅ Good
  private readonly UNAUTHORIZED_STATUS = 401;
  if (status === this.UNAUTHORIZED_STATUS) { ... }
  ```

## Mandatory Vitest Rules

### 1. Vitest Syntax
- ALWAYS import from `vitest`: `describe`, `it`, `beforeEach`, `expect`, `vi`.
- DO NOT use Jasmine (`jasmine.createSpy`) or Karma-specific syntax.
- Use `vi.fn()` for mocks and `vi.spyOn()` for spies.

### 2. TestBed for Standalone Components
- Configure `TestBed` using the `imports` array — **NOT** `declarations`:
  ```typescript
  await TestBed.configureTestingModule({
    imports: [ExampleComponent, provideHttpClientTesting()],
  }).compileComponents();
  ```

### 3. Mocking Dependencies
- Isolate components by mocking injected services:
  ```typescript
  const mockUserService = { getCurrentUser: vi.fn() };
  TestBed.overrideProvider(UserService, { useValue: mockUserService });
  ```

### 4. Testing Signals
- Always call `fixture.detectChanges()` after updating Signals to trigger DOM updates.
- Test both the Signal state and the resulting DOM output:
  ```typescript
  it('should show loading spinner when isLoading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.spinner')).toBeTruthy();
  });
  ```

## Workflow

### Step 1: Read the Source File
Read the Angular v21 `.ts` file to be reviewed/tested.

### Step 2: Apply Clean Code Review
Identify violations:
- [ ] Abbreviations or unclear names → rename
- [ ] Functions doing more than one thing → extract
- [ ] Deep nesting → add guard clauses
- [ ] Magic values → extract to constants/enums
- [ ] Unused imports or dead code → remove

### Step 3: Produce the Refactored File
Output the clean version of the `.ts` file with all violations fixed.

### Step 4: Write the Vitest Spec File
For each public method and Signal, write tests covering:
- **Happy path** — expected behavior with valid inputs
- **Edge cases** — empty arrays, null/undefined, boundary values
- **Error cases** — API failures, invalid state transitions

**Spec file skeleton:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Step 5: Summarize Improvements
List:
- Which Clean Code improvements were made and why
- Which edge cases the tests cover

## Expected Output Format
1. The refactored source `.ts` file with Clean Code improvements applied
2. The complete `.spec.ts` file written exclusively for Vitest
3. A brief summary of Clean Code improvements and test coverage rationale
