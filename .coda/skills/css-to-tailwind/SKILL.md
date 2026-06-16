---
name: css-to-tailwind
description: >
  Converts legacy CSS, SASS, LESS, and BEM classes into modern utility-first Tailwind CSS
  classes within Angular v21 HTML templates. Removes stylesheet bloat and maps pixel values,
  colors, flexbox, and grid rules to Tailwind equivalents.
  Use when the user asks to "convert to Tailwind", "migrate styles", "remove CSS classes",
  or "apply Tailwind" to any component or template.
execution:
  context: native
  timeout: 120
---

# CSS to Tailwind CSS Conversion

Convert legacy CSS, SASS, LESS, or BEM-based styles into modern utility-first Tailwind CSS
applied directly to Angular v21 HTML templates.

## Mandatory Rules

### 1. Utility-First Approach
- Completely remove legacy CSS classes from `.scss` or `.css` files whenever possible.
- Apply Tailwind utility classes directly to HTML elements.
- The resulting stylesheet should be mostly empty (only necessary overrides remain).

### 2. Avoid @apply
- DO NOT use the `@apply` directive unless explicitly instructed or for deeply nested
  third-party component overrides that cannot be styled via HTML attributes.

### 3. Mapping Legacy Styles
- Convert absolute pixel values to the Tailwind spacing/sizing scale:
  - `4px` → `p-1` / `m-1`, `8px` → `p-2` / `m-2`, `16px` → `p-4` / `m-4`, etc.
- Convert custom hex colors to the closest Tailwind color palette:
  - If an exact match exists, use it (e.g., `#3b82f6` → `text-blue-500`).
  - If no match, use arbitrary values (e.g., `text-[#ff6600]`).
- Translate layout patterns:
  - Flexbox: `display:flex` + `align-items:center` → `flex items-center`
  - Grid: `display:grid` + `grid-template-columns:repeat(3,1fr)` → `grid grid-cols-3`
  - Positioning: `position:relative` → `relative`, `position:absolute` → `absolute`
- Translate typography:
  - `font-size:14px` → `text-sm`, `font-weight:700` → `font-bold`
  - `text-align:center` → `text-center`

### 4. Angular Context
- Respect Angular v21 Control Flow (`@if`, `@for`). Do not alter structural logic.
- Handle dynamic class bindings:
  - `[class.text-red-500]="hasError()"` for signal-based conditionals
  - `[ngClass]` should be replaced with conditional Tailwind bindings where possible.

## Workflow

### Step 1: Read the Existing Styles
Read the component's `.scss` / `.css` file and its `.html` template to understand the
current class names and their computed styles.

### Step 2: Map Each Rule to Tailwind
For every CSS rule, identify the closest Tailwind utility or arbitrary value equivalent.
Create a mapping table mentally:

| Legacy Rule | Tailwind Equivalent |
|---|---|
| `margin: 16px` | `m-4` |
| `display: flex; align-items: center` | `flex items-center` |
| `font-size: 1.25rem` | `text-xl` |
| `background-color: #3b82f6` | `bg-blue-500` |
| `border-radius: 0.5rem` | `rounded-lg` |

### Step 3: Update the HTML Template
- Replace `class="legacy-class"` with inline Tailwind utilities.
- Preserve Angular bindings and control flow exactly as-is.
- For conditional classes, use `[class.tw-class]="signal()"` syntax.

### Step 4: Clean the Stylesheet
- Remove all rules that are now covered by Tailwind utilities.
- Keep only:
  - Complex animations (`@keyframes`)
  - Third-party component overrides
  - CSS custom properties (`--var`) if still needed

### Step 5: Document Complex Mappings
List any non-trivial CSS patterns that required special handling (e.g., custom grid layouts,
specific animations, pseudo-element tricks).

## Expected Output Format
1. The updated HTML template with Tailwind classes applied
2. The updated CSS/SCSS file (mostly empty, only necessary overrides)
3. A brief list of complex CSS patterns and how they were mapped to Tailwind utilities
