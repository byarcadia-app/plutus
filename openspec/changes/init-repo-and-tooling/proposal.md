## Why

`@byarcadia-app/plutus` needs a proper git repository, GitHub remote, and tooling infrastructure matching `@byarcadia-app/aether` conventions. This ensures consistent CI/CD, versioning (changesets), contribution guidelines, and publishing workflow across the byarcadia package ecosystem.

## What Changes

- Initialize git repo and push to `git@github.com:byarcadia-app/plutus.git`
- Add `.gitignore` matching aether conventions
- Add `.npmrc` with hoisted node-linker and registry config
- Add MIT `LICENSE` (Dominik Woźniak, 2026)
- Add `CONTRIBUTING.md` adapted for plutus (RevenueCat wrapper, hooks-focused)
- Add base `README.md` with package description, installation, usage examples, API reference
- Setup `.changeset/config.json` for public npm publishing with GitHub changelog
- Add `.github/` CI workflow, release workflow, PR template, issue templates
- Add `CHANGELOG.md` with initial 0.1.0 entry

## Capabilities

### New Capabilities
<!-- No new code capabilities — this is repo/tooling setup only -->

### Modified Capabilities
<!-- None -->

## Impact

- **Repository**: New GitHub remote at `byarcadia-app/plutus`
- **CI/CD**: Automated type checking, linting, and building on PR/push
- **Publishing**: Changesets-driven npm publishing with GitHub Packages support
- **Versioning**: Synchronized with aether via changesets `linked` config
