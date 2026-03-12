# AI Development Guide — @byarcadia-app/plutus

RevenueCat wrapper for React Native in-app purchases. Callback-driven, zero app-specific dependencies.

## Tech Stack

- TypeScript (strict), React 19, React Native 0.81
- react-native-purchases (RevenueCat)
- tsup (CJS + ESM + DTS)
- oxlint / oxfmt
- changesets (versioning)
- pnpm v10 (monorepo with `example/` app)

## Scripts

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `pnpm build`     | Build with tsup (CJS + ESM + DTS) |
| `pnpm dev`       | Build in watch mode                |
| `pnpm check`     | TypeScript type checking           |
| `pnpm lint`      | Lint with oxlint                   |
| `pnpm fmt`       | Format with oxfmt                  |
| `pnpm fmt:check` | Check formatting                   |

## Validation

Before completing any task, run:

    pnpm check && pnpm lint && pnpm fmt:check && pnpm build && pnpm --filter @byarcadia-app/plutus-example exec tsc --noEmit

## Changesets

After any code change (not docs-only), add a changeset:

    pnpm changeset

- `patch` — bug fix
- `minor` — new hook or feature
- `major` — breaking API change

See CONTRIBUTING.md for commit conventions and PR checklist.

## Example App as Source of Truth

`example/` demonstrates how consumers use the library. After any API change in `src/`, update `example/` to reflect the new usage. If example doesn't typecheck, the change is incomplete.

See `example/AGENTS.md` for example-specific context.

## Hook Conventions

- All app-specific concerns (alerts, navigation, analytics) via callbacks — never baked in
- Use `onTrackEvent` fallback: hook-level callback ?? provider-level callback
- Return `PlutusError` in error callbacks, not translated strings
- New hooks: create `src/hooks/use-{name}.ts`, consume `usePlutus()`, export from `src/index.ts`

## Documentation

Every public API must have JSDoc with `@example` tag. When `docs/` directory exists, keep it in sync with code changes.

## OpenSpec — Spec-Driven Development

We use [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven development. Proposals, designs, specs, and task breakdowns live in `openspec/`.

### Workflow

1. `/openspec-explore` — Think through ideas, investigate problems, clarify requirements
2. `/openspec-propose` — Create a change proposal with design, specs, and tasks
3. `/openspec-apply-change` — Implement tasks from a proposed change
4. `/openspec-verify-change` — Validate implementation matches the spec
5. `/openspec-archive-change` — Archive a completed change
