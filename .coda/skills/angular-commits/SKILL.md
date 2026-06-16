---
name: angular-commits
description: >
  Groups staged Angular files by feature/module folder and labels each group with a
  Conventional Commits type (feat, fix, refactor, chore, style, test, docs, perf).
  Generates commit messages in `type(scope): description` format, presents the full
  plan for review, then executes each commit one by one after user approval — including
  the git staging dance (unstage all → re-stage per group → commit).
  Use whenever you need to split Angular staged changes into clean semantic git commits,
  or when the user says things like "commit my changes", "group my staged files",
  "semantic commits", or "angular commit conventions".
execution:
  context: native
  timeout: 120
---

# Angular Semantic Commits

Split a mixed set of staged Angular files into focused, well-labelled Conventional Commits —
grouped by feature folder, typed by the nature of the change, and executed one at a time
after the user approves each message.

## Prerequisites

- A git repository with files already staged (`git add` has been run)
- The working directory must be the repository root
- No in-progress rebase or merge

## Workflow

### Step 1: Discover Staged Files

Run the following command to get the full list of staged files along with their change type
(Added, Modified, Deleted, Renamed):

```bash
git diff --cached --name-status
```

If there are **no staged files**, stop immediately and tell the user:
> "Nothing is staged. Run `git add <files>` first, then trigger this skill again."

### Step 2: Group Files by Feature Folder

Parse the file paths and form groups based on Angular project conventions:

| Path pattern | Scope (used in commit message) |
|---|---|
| `src/app/<feature>/...` | `<feature>` (e.g., `auth`, `dashboard`, `shared`) |
| `src/app/core/...` | `core` |
| `src/app/shared/...` | `shared` |
| `src/environments/...` | `environments` |
| `src/styles.*`, `*.scss`, `*.css` at root | `styles` |
| `package.json`, `package-lock.json`, `yarn.lock` | `deps` |
| `angular.json`, `tsconfig*.json`, `.eslintrc*`, `.editorconfig`, `karma.conf.js` | `config` |
| `*.md`, `docs/...` | `docs` |
| `e2e/...`, `cypress/...` | `e2e` |
| Other root-level files | `root` |

**Grouping rules:**
- Keep together files that belong to the same Angular module/feature folder (e.g., all files inside `src/app/auth/` form one group).
- Keep related Angular artefacts together: a component's `.ts`, `.html`, and `.scss` belong in the same commit.
- If a folder contains both feature logic and spec files (`.spec.ts`), split them into two groups: one for the feature code and one for the tests — unless the spec was added alongside a brand-new file, in which case keep them together as `feat`.
- Config-only changes (angular.json, tsconfig, eslint) form their own `chore(config)` group.
- Dependency changes (package.json) form their own `chore(deps)` group.

### Step 3: Infer the Conventional Commit Type

For each group, infer the commit type from these signals (apply the first rule that matches):

1. **`test`** — the group contains *only* `*.spec.ts` or `*.test.ts` files.
2. **`docs`** — the group contains only `*.md` or files under `docs/`.
3. **`style`** — the group contains only `*.scss`, `*.css`, or `*.less` files.
4. **`chore`** — the group contains config/tooling files (angular.json, tsconfig, eslint, package.json, Dockerfile, CI yamls).
5. **`feat`** — the group contains at least one **new file** (git status `A`) that implements a new capability.
6. **`fix`** — the group modifies existing files and the file name or path hints at a bug fix (e.g., contains "fix", "bug", "patch", or the change is in an error-handling area).
7. **`refactor`** — the group modifies existing files without adding new public behaviour (renames, restructuring, code cleanup).
8. **`perf`** — when the change is explicitly about performance (e.g., memoization, lazy loading, OnPush).
9. When in doubt between `feat` and `refactor`, prefer `feat` if new files are involved, `refactor` otherwise.

### Step 4: Generate the Commit Message

Use the **Conventional Commits** format:

```
type(scope): short imperative description
```

Rules for the description:
- Start with a lowercase verb in the imperative mood: "add", "remove", "update", "extract", "fix", "migrate" — not "added" or "adds".
- Keep it under 72 characters total (including `type(scope): `).
- Be specific: `feat(auth): add JWT refresh token interceptor` beats `feat(auth): update auth`.
- Do not end with a period.

**Example messages:**

```
feat(auth): add JWT refresh token interceptor
fix(cart): prevent duplicate item on rapid click
refactor(shared): extract reusable confirm-dialog component
test(profile): add unit tests for avatar upload service
chore(config): update eslint rules for standalone components
style(dashboard): apply brand color tokens to KPI cards
docs(readme): document environment variable setup
```

### Step 5: Present the Commit Plan

Display the complete proposed plan before touching any commits. Use this format:

```
📋 Proposed Commit Plan
────────────────────────────────────────────
Group 1 — feat(auth): add JWT refresh token interceptor
  • src/app/auth/interceptors/jwt-refresh.interceptor.ts  [A]
  • src/app/auth/interceptors/jwt-refresh.interceptor.spec.ts  [A]

Group 2 — chore(config): update eslint rules for standalone components
  • .eslintrc.json  [M]

Group 3 — refactor(shared): extract reusable confirm-dialog component
  • src/app/shared/components/confirm-dialog/confirm-dialog.component.ts  [M]
  • src/app/shared/components/confirm-dialog/confirm-dialog.component.html  [M]
────────────────────────────────────────────
3 commits planned. Proceed group by group?
```

Wait for user acknowledgement before continuing.

### Step 6: Execute Commits One by One

For **each group**, in order:

1. **Show the group** — list its files and the proposed commit message.
2. **Ask for confirmation** — the user can:
   - **Confirm** → execute the commit
   - **Edit message** → accept the user's revised message, then execute
   - **Skip** → leave those files staged and move on
3. **Execute** using this exact sequence:

```bash
# 1. Unstage all currently staged files (first group only — or whenever you start)
git restore --staged .

# 2. Stage only the files in this group
git add src/app/auth/interceptors/jwt-refresh.interceptor.ts \
        src/app/auth/interceptors/jwt-refresh.interceptor.spec.ts

# 3. Commit
git commit -m "feat(auth): add JWT refresh token interceptor"
```

4. After each successful commit, re-stage the files belonging to the **remaining groups** so the user's staged state is preserved:

```bash
# Re-stage remaining files so they are not lost
git add <all-files-from-remaining-groups>
```

5. Report the commit hash: `✅ Committed: abc1234 — feat(auth): add JWT refresh token interceptor`

6. Move on to the next group.

### Step 7: Final Summary

After all groups are processed, print a summary:

```
✅ Done! 3 commits created:
  abc1234  feat(auth): add JWT refresh token interceptor
  def5678  chore(config): update eslint rules for standalone components
  ghi9012  refactor(shared): extract reusable confirm-dialog component

Skipped: 0 groups
Still staged: 0 files
```

If any groups were skipped, list their files so the user knows what remains staged.

## Edge Cases

- **Single-file groups:** Still commit them individually — a solo `chore(deps): bump @angular/core to v19` is a valid, clean commit.
- **Renamed files:** Treat the destination path for grouping; the commit type is typically `refactor` unless the rename accompanies new logic.
- **Deleted files:** Group with related additions if they are a replacement; otherwise form a separate `refactor` or `chore` commit.
- **Root-level files with no clear feature:** Use scope `root` and type `chore` as a safe default.
- **User edits the message:** Accept the full revised string verbatim — do not re-validate or re-infer.
- **Commit fails (e.g., pre-commit hook):** Report the error output clearly, ask the user whether to retry, fix, or skip. Do not silently continue.

## Notes

- This skill only operates on **staged** files. Unstaged modifications are never touched.
- The `git restore --staged .` command in Step 6 is safe because all file paths are tracked and will be re-staged in the same step.
- Scopes are derived from the Angular project folder structure. If the project uses a non-standard layout (e.g., Nx monorepo), adjust scope derivation by reading the top-level `project.json` or `angular.json` workspace configuration first.
