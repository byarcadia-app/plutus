# Documentation Templates

Two template variants for @byarcadia-app/plutus documentation.

## Conventions

- Import path: `@byarcadia-app/plutus`
- Only document content from the existing source — no speculative examples
- Use relative links between docs (from file location)
- Props/options tables use: `| Prop | Type | Default | Description |`

---

## Hook Template

For hooks: usePlutus, useOfferings, usePaywall, useRescuePaywall.

```markdown
### {hookName}

{One-line description.}

#### Import

\`\`\`tsx
import { {hookName} } from "@byarcadia-app/plutus";
\`\`\`

#### Options

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| ...    | ...  | ...     | ...         |

#### Returns

| Property | Type | Description |
| -------- | ---- | ----------- |
| ...      | ...  | ...         |

#### Usage

\`\`\`tsx
{Code example}
\`\`\`
```

---

## Provider Template

For PlutusProvider documentation.

```markdown
# PlutusProvider

{One-line description.}

## Import

\`\`\`tsx
import { PlutusProvider } from "@byarcadia-app/plutus";
\`\`\`

## Usage

\`\`\`tsx
{Code example}
\`\`\`

## API Reference

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| ...  | ...  | ...     | ...         |
```
