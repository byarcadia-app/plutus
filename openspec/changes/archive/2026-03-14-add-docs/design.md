## Context

Plutus currently has a single `README.md` covering all documentation. The sibling package `@byarcadia-app/aether` has a mature `docs/` directory with an index, installation guide, API reference pages, and a contributor template. We want to replicate this structure for Plutus so both packages feel consistent.

## Goals / Non-Goals

**Goals:**

- Create a `docs/` directory mirroring aether's structure adapted for Plutus's API surface
- Restyle `README.md` to match aether's format (brief overview + links to docs)
- Document all public APIs: PlutusProvider, usePlutus, useOfferings, usePaywall, useRescuePaywall, errors, translations

**Non-Goals:**

- Co-located component docs (Plutus has no UI components, unlike aether)
- Generated API docs from TypeScript (manual markdown is sufficient for this scope)
- Changing any source code or public APIs

## Decisions

**1. File structure — flat `docs/` with one file per concern**

Aether has component docs co-located in `src/ui/`. Plutus has no UI components, so all docs live in `docs/`. The structure:

```
docs/
├── README.md          # Index
├── _template.md       # Contributor template for hook docs
├── installation.md    # Install + quick start
├── provider.md        # PlutusProvider props & usage
├── hooks.md           # useOfferings, usePaywall, useRescuePaywall
├── errors.md          # PlutusError, error codes, factory functions
└── translations.md    # Translation system & overrides
```

Alternative considered: one file per hook. Rejected because Plutus only has 3 hooks — a single `hooks.md` is more scannable.

**2. README.md restyling — match aether's sections**

Aether's README has: banner, badges, brief "what it does", documentation links, requirements, license. Plutus's README will follow the same sections, replacing the current inline API reference with links to `docs/`.

**3. Template — adapted from aether's `_template.md`**

Aether's template covers simple and compound components. Plutus's template will cover hooks and the provider, with the same props table format (`| Prop | Type | Default | Description |`).

## Risks / Trade-offs

- **Docs drift**: Documentation may fall out of sync with code. Mitigation: AGENTS.md already states "When `docs/` directory exists, keep it in sync with code changes."
- **Duplication with README**: Some content (installation, quick start) moves from README to docs. README keeps a short version and links out. Minor duplication is acceptable for discoverability.
