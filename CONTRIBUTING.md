# Contributing

Contributions are always welcome, no matter how large or small!

## Before You Start

### Important Guidelines

@byarcadia-app/plutus is a RevenueCat wrapper for React Native in-app purchases. To ensure consistency and quality:

**Do NOT** without prior discussion:

- Change the public hook API signatures
- Add dependencies beyond `react-native-purchases`
- Modify existing callback contracts
- Add app-specific logic (alerts, navigation, analytics) into the package

### How to Propose Changes

1. **GitHub Issues** — Bug reports and small improvements
2. **GitHub Discussions** — Feature proposals, API changes, new hook ideas. Include use cases, examples, and rationale.

### What We're Looking For

The best contributions are:

- **Bug fixes** for existing issues
- **Documentation improvements**
- **New hooks** that compose on top of `usePlutus` (discuss first)
- **Type improvements** and better generics
- **Performance optimizations** (without changing behavior)

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (check `.nvmrc` if present)
- [pnpm](https://pnpm.io/) v10+

### Install Dependencies

```sh
pnpm install
```

> This project uses pnpm. Do not use `npm` or `yarn`.

### Verification

Make sure your code passes type checking and linting before submitting:

```sh
pnpm check    # TypeScript (tsc --noEmit)
pnpm lint     # Lint with oxlint
pnpm fmt:check # Check formatting with oxfmt
```

To auto-fix formatting:

```sh
pnpm fmt
```

### Build

```sh
pnpm build    # Build with tsup (CJS + ESM + DTS)
pnpm dev      # Build in watch mode
```

### All Scripts

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm build`     | Build with tsup (CJS + ESM + DTS) |
| `pnpm dev`       | Build in watch mode               |
| `pnpm check`     | TypeScript type checking          |
| `pnpm lint`      | Lint with oxlint                  |
| `pnpm fmt`       | Format with oxfmt                 |
| `pnpm fmt:check` | Check formatting                  |

## Hook Conventions

### File Organization

```
src/
├── index.ts                    # Barrel exports
├── types.ts                    # All type definitions
├── translations.ts             # Default translations
├── provider/
│   ├── plutus-provider.tsx     # Provider component
│   └── use-plutus.ts           # Context consumer hook
└── hooks/
    ├── use-offerings.ts        # Offerings hook
    ├── use-paywall.ts          # Paywall hook
    └── use-rescue-paywall.ts   # Rescue paywall hook
```

### Adding a New Hook

1. Create `src/hooks/use-{name}.ts`
2. Consume `usePlutus()` for provider state and callbacks
3. Accept per-hook callbacks with provider-level `onTrackEvent` fallback
4. Export types from `src/types.ts`
5. Re-export from `src/index.ts`

### Rules

- All app-specific concerns (alerts, navigation, analytics, haptics) must be configurable via callbacks
- No hard-coded dependencies on i18n, navigation, or logging libraries
- Use `onTrackEvent` fallback pattern: hook-level callback ?? provider-level callback
- Return structured error data (`PlutusError`) in error callbacks, not translated strings

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en) specification:

- `fix`: bug fixes, e.g. fix purchase cancellation handling
- `feat`: new features, e.g. add new hook
- `refactor`: code refactor, e.g. extract shared purchase logic
- `docs`: documentation changes, e.g. add usage example
- `test`: adding or updating tests
- `chore`: tooling changes, e.g. update build config

## Changesets

We use [changesets](https://github.com/changesets/changesets) for versioning and changelogs. If your change affects the public API or fixes a bug, add a changeset:

```sh
pnpm changeset
```

This will prompt you to:

1. Select the package (`@byarcadia-app/plutus`)
2. Choose the semver bump type (`patch`, `minor`, `major`)
3. Write a summary of the change

The changeset file is committed with your PR and consumed during the release process.

**When to add a changeset:**

- Bug fix → `patch`
- New hook or feature → `minor`
- Breaking API change → `major`
- Documentation-only changes → no changeset needed

## Sending a Pull Request

### Before Opening a PR

1. **Ensure alignment** — your PR should:
   - Fix an existing issue, OR
   - Implement a feature that was discussed and approved

2. **Do NOT open PRs for**:
   - API changes not discussed beforehand
   - Adding app-specific logic into the package
   - Breaking changes without discussion

### PR Checklist

- [ ] Code passes `pnpm check` (TypeScript)
- [ ] Code passes `pnpm lint` (oxlint)
- [ ] Code passes `pnpm fmt:check` (oxfmt)
- [ ] Build succeeds with `pnpm build`
- [ ] New public APIs have JSDoc with `@example` tags
- [ ] Changeset added (if applicable)
- [ ] PR is focused on a single change
- [ ] Commit messages follow conventional commits

### PR Review Process

- Prefer small, focused pull requests
- Include context in the PR description — what changed and why
- Link related issues or discussions

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
