---
name: git-flow-manager
description: >
  Manages Git Flow release planning using Standard Git Flow (main/develop/feature/release/hotfix
  branches) and semantic versioning (vX.Y.Z). Analyzes commits since the last git tag,
  parses Conventional Commits (feat → minor, fix → patch, BREAKING CHANGE → major),
  suggests the next semver bump with full reasoning, and drafts a structured CHANGELOG.
  Also recommends the next Git Flow steps (release branch name, version file updates, merge targets).
  Use when the user says things like "plan a release", "what's the next version", "generate changelog",
  "prepare release", "bump version", "analyze commits for release", or "what changed since last tag".
execution:
  context: native
  timeout: 180
---

# Git Flow Release Planner

Analyze the commit history since the last git tag, determine the correct semantic version bump
following Conventional Commits rules, and produce a release-ready CHANGELOG draft along with
the recommended Git Flow next steps.

## Prerequisites

- A git repository using Standard Git Flow (branches: `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`)
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/) spec:
  - `feat:` or `feat(scope):` → new feature
  - `fix:` or `fix(scope):` → bug fix
  - `BREAKING CHANGE:` footer OR `!` after type (e.g. `feat!:`) → breaking change
  - Other types: `chore`, `docs`, `refactor`, `perf`, `test`, `style`, `ci`
- `git` available in PATH

## Workflow

### Step 1: Discover the Latest Tag and Commit Range

Run these commands to establish the baseline:

```bash
# Get the most recent semver tag
git describe --tags --abbrev=0 --match "v*" 2>/dev/null || echo "NO_TAG"

# List all commits since the last tag (or all commits if no tag exists)
git log <last_tag>..HEAD --pretty=format:"%H %s" --no-merges

# If no tag was found, use the full history:
git log --pretty=format:"%H %s" --no-merges
```

If there are **no commits since the last tag**, stop and inform the user:
> "No new commits found since `<last_tag>`. Nothing to release."

### Step 2: Parse Commits Using Conventional Commits Rules

For each commit subject, classify it into one of these categories:

| Commit pattern | Category | Version impact |
|---|---|---|
| `feat!:`, `fix!:`, any type with `!`, or body/footer contains `BREAKING CHANGE:` | Breaking Change | **MAJOR bump** |
| `feat:` or `feat(scope):` | Feature | **MINOR bump** |
| `fix:` or `fix(scope):` | Bug Fix | **PATCH bump** |
| `perf:` | Performance | **PATCH bump** |
| `revert:` | Revert | **PATCH bump** |
| `docs:`, `chore:`, `test:`, `style:`, `ci:`, `build:`, `refactor:` | Non-release type | No version impact |

**Bump precedence:** MAJOR > MINOR > PATCH. A single breaking change forces a MAJOR bump regardless of other commits.

To check for `BREAKING CHANGE` in commit bodies (not just subjects), run:

```bash
git log <last_tag>..HEAD --pretty=format:"%H%n%B%n---COMMIT_END---" --no-merges
```

Look for the literal string `BREAKING CHANGE:` in the body of each commit.

### Step 3: Calculate the Next Version

Given the current version from the last tag (e.g., `v1.4.2`):

1. Parse the current version: `MAJOR=1`, `MINOR=4`, `PATCH=2`
2. Apply the highest-priority bump found:
   - **MAJOR bump:** `v2.0.0` (reset MINOR and PATCH to 0)
   - **MINOR bump:** `v1.5.0` (reset PATCH to 0)
   - **PATCH bump:** `v1.4.3`
3. If no tag exists yet, propose `v0.1.0` for a first MINOR release or `v1.0.0` if the codebase appears stable.

Present the reasoning clearly:
> "Found 3 `feat:` commits and 2 `fix:` commits → **MINOR bump** → next version: `v1.5.0`"

### Step 4: Draft the CHANGELOG

Generate a CHANGELOG entry following [Keep a Changelog](https://keepachangelog.com/) format, grouped by commit type.
Only include sections that have at least one entry.

Use this template:

```markdown
## [v<NEXT_VERSION>] - <TODAY_DATE>

### ⚠️ Breaking Changes
- <commit subject> (<short_hash>)

### ✨ Features
- <commit subject> (<short_hash>)

### 🐛 Bug Fixes
- <commit subject> (<short_hash>)

### ⚡ Performance
- <commit subject> (<short_hash>)

### ↩️ Reverts
- <commit subject> (<short_hash>)
```

**Rules for the CHANGELOG:**
- Omit sections with no entries (e.g., skip `### ⚡ Performance` if no `perf:` commits)
- Strip the commit type prefix from the message body (e.g., `feat: add login page` → `add login page`)
- Include the 7-character short hash in parentheses for traceability
- Omit `docs:`, `chore:`, `test:`, `style:`, `ci:`, `build:` commits — they are not user-facing
- If a commit has a scope, include it: `feat(auth): add OAuth2 support` → `add OAuth2 support (auth)`

### Step 5: Recommend Git Flow Next Steps

After presenting the version and CHANGELOG, suggest the concrete Git Flow actions:

```
Next steps for releasing v<NEXT_VERSION>:

1. Create the release branch from develop:
   git checkout develop
   git checkout -b release/v<NEXT_VERSION>

2. Bump the version in your version file (if applicable):
   - package.json  → "version": "<NEXT_VERSION_NO_V>"
   - VERSION       → <NEXT_VERSION_NO_V>
   - pyproject.toml → version = "<NEXT_VERSION_NO_V>"

3. Commit the version bump:
   git commit -am "chore(release): bump version to v<NEXT_VERSION>"

4. Merge into main and tag:
   git checkout main
   git merge --no-ff release/v<NEXT_VERSION>
   git tag -a v<NEXT_VERSION> -m "Release v<NEXT_VERSION>"

5. Merge back into develop:
   git checkout develop
   git merge --no-ff release/v<NEXT_VERSION>

6. Delete the release branch:
   git branch -d release/v<NEXT_VERSION>
```

Ask the user if they want Coda to execute any of these steps automatically.

## Output Format

Always present the result in this order:

1. **Commit summary table** — list each commit with its type, scope, subject, and version impact
2. **Version bump decision** — current version → next version, with the rule that triggered the bump
3. **CHANGELOG draft** — ready to copy into `CHANGELOG.md`
4. **Git Flow next steps** — concrete commands for the release process

## Error Handling

| Situation | Action |
|---|---|
| No git repository found | Stop and tell the user: "Not inside a git repository." |
| No commits at all | Stop and tell the user: "Repository has no commits yet." |
| Last tag is not semver (`vX.Y.Z`) | Warn the user and ask them to confirm the current version manually |
| All commits are non-release types only | Inform: "No releasable commits found (only chore/docs/test changes). No version bump needed." |
| Detached HEAD state | Warn the user and suggest checking out `develop` before planning the release |

## Examples

**Example 1: Minor release**

Commits since `v1.2.0`:
- `feat(auth): add Google OAuth login`
- `fix(api): handle null response from user endpoint`
- `docs: update README setup instructions`
- `chore: update dependencies`

Result: **MINOR bump** → `v1.3.0`

CHANGELOG:
```markdown
## [v1.3.0] - 2026-06-17

### ✨ Features
- add Google OAuth login (auth) (a1b2c3d)

### 🐛 Bug Fixes
- handle null response from user endpoint (api) (e4f5g6h)
```

**Example 2: Breaking change (major release)**

Commits since `v2.0.1`:
- `feat!: redesign authentication API — removes /api/v1/login`
- `fix: correct token expiry calculation`

Result: **MAJOR bump** → `v3.0.0` (breaking change overrides everything)

**Example 3: Patch-only release**

Commits since `v0.9.4`:
- `fix: prevent crash on empty input`
- `fix(ui): resolve button alignment on mobile`
- `perf: cache repeated database queries`

Result: **PATCH bump** → `v0.9.5`

## Notes

- This skill reads git history but does **not** make any git commits, tag creations, or branch operations unless explicitly asked by the user in Step 5.
- Conventional Commits parsing is done by reading `git log` output — no external tools (e.g., `standard-version`, `semantic-release`) are required.
- For monorepos with multiple packages, ask the user which package/path to scope the commit analysis to (`git log -- <path>`).
