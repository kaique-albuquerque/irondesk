# Contributing to IronDesk

[Português](./CONTRIBUTING.pt-BR.md) | **English**

Thanks for your interest. This document describes the repository workflow — read it before opening an
issue or a pull request.

## Before you start

- IronDesk is a portfolio project. It is maintained by one person, so reviews may take a few days.
- **The `main` branch is protected.** Nothing gets into it through a direct push: all work goes
  through a pull request. This applies to the maintainer too.
- For large changes (new feature, architecture refactor, swapping a core dependency), **open an issue
  first**. That way you avoid implementing something that will not be accepted.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Git

## Setting up the environment

```bash
git clone https://github.com/kaique-albuquerque/irondesk.git
cd irondesk
npm install
npm run dev
```

The app starts at [http://localhost:5173](http://localhost:5173).

## Workflow

1. **Sync `main`**

   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a branch off `main`.** Use a prefix that signals the nature of the work:

   | Prefix | Use | Example |
   | --- | --- | --- |
   | `feat/` | new feature | `feat/excel-export` |
   | `fix/` | bug fix | `fix/duplicate-checkin` |
   | `docs/` | documentation | `docs/deploy-guide` |
   | `refactor/` | refactor with no behavior change | `refactor/payments-service` |
   | `chore/` | config, dependencies, build | `chore/update-vite` |

   ```bash
   git checkout -b feat/my-contribution
   ```

3. **Implement, validating locally** (see [Mandatory verification](#mandatory-verification)).

4. **Make small commits with clear messages**, following
   [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

   ```text
   feat(finance): allow partial payment refund

   Adds a refund action with an informed amount and records the
   change history on the original charge.
   ```

5. **Push the branch and open the pull request**

   ```bash
   git push -u origin feat/my-contribution
   ```

   The PR template appears automatically. Fill in the context, what changed and how you tested it.

## Mandatory verification

Every pull request must pass these three checks before it can be merged:

```bash
npm run typecheck    # TypeScript with no errors
npm run build        # working production build
```

And on manual review:

- **No code file may exceed 150 lines.** It is a project rule. Check with:

  ```powershell
  Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx |
    ForEach-Object { [pscustomobject]@{ Lines = (Get-Content $_.FullName).Count; Path = $_.FullName } } |
    Sort-Object Lines -Descending | Select-Object -First 10
  ```

- **No explicit `any`.** Everything is typed by domain interfaces.
- **No dead buttons.** If it shows up in the UI, it works — or it does not show up.
- **Clean console.** Walk through the changed flow and confirm there are no browser console errors.

## Code standards

### Layered structure

Respect the dependency direction. The UI **never** accesses `LocalStorage` directly:

```text
pages → hooks → services/api → services/mock → services/storage → LocalStorage
```

- **Business rules** live in `src/services/api/*.service.ts`.
- A **component** does not compute business rules; it receives ready data.
- **Form validation** lives in `src/schemas/*.schema.ts` (Zod).
- **Data access** goes through `services/storage`; no component reads `localStorage`.

### Conventions

- Components: `PascalCase.tsx`, one responsibility per file.
- Services, hooks and utilities: `camelCase.ts` (`students.service.ts`, `useAsyncData.ts`).
- Interfaces: `*.interface.ts`, `View` suffix for derived types with aggregated data.
- UI copy in **Brazilian Portuguese**.
- Styling with Tailwind and the design system tokens (`bg-surface`, `text-ink`, `text-muted`,
  `border-line`, `text-accent-ink`...). Do not introduce loose hex colors — use the tokens from
  `src/styles/index.css`.
- Before creating a UI component, check whether the primitive already exists in `src/components/ui`.

### Commits

- One subject per commit.
- Imperative message, in Portuguese: `corrige`, `adiciona`, `remove`, `ajusta`.
- Reference the issue when there is one: `closes #12`.

## Opening an issue

Use the templates available under **Issues → New issue**:

- **Bug** — unexpected behavior, with steps to reproduce.
- **Feature request** — the problem the change solves, before the proposed solution.

Always include:

- what you expected and what happened;
- steps to reproduce;
- browser and operating system;
- screenshot or screen recording when it is visual.

## Pull request review

- The maintainer may request changes, split the work into smaller parts or decline the contribution if
  it falls outside the project scope.
- PRs that break `typecheck`/`build`, introduce `any` or exceed 150 lines per file are not merged.
- On merge the branch is deleted. Sync your `main` before starting the next piece of work.

## Project scope

IronDesk is deliberately a **backend-free** demo. Contributions that add a server, database, real
authentication or real billing are outside the scope of this repository — the
[README](./README.md#12-what-production-would-require) describes what production would require.

## Security and data

- **Never** commit secrets, tokens, `.env` files or real personal data.
- All project data is fictional. Do not put real people's information into the seeds.
- Found a vulnerability? See [SECURITY.md](./SECURITY.md) — do not open a public issue.

## Code of conduct

By taking part, you agree to the [Code of Conduct](./CODE_OF_CONDUCT.md).
