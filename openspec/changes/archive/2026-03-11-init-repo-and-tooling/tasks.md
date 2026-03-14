## 1. Git and GitHub Setup

- [x] 1.1 Initialize git repo (`git init`), create initial commit with existing source code
- [x] 1.2 Add remote `origin` pointing to `git@github.com:byarcadia-app/plutus.git`
- [x] 1.3 Create `.gitignore` matching aether conventions (node_modules, dist, .env\*, .DS_Store, coverage, .expo, etc.)

## 2. Root Config Files

- [x] 2.1 Create `.npmrc` with `node-linker=hoisted`, npm registry, GitHub Packages auth token config
- [x] 2.2 Create `LICENSE` — MIT, copyright 2026 Dominik Woźniak
- [x] 2.3 Create `CONTRIBUTING.md` adapted for plutus — RevenueCat wrapper focus, hook conventions, pnpm, changeset workflow, conventional commits
- [x] 2.4 Create base `README.md` — package description, installation, quick start usage example, API reference (PlutusProvider, usePlutus, useOfferings, usePaywall, useRescuePaywall), requirements table, license

## 3. Changeset Setup

- [x] 3.1 Create `.changeset/config.json` — public access, GitHub changelog (`byarcadia-app/plutus` repo), `main` base branch, `linked` array including `["@byarcadia-app/aether", "@byarcadia-app/plutus"]` for version synchronization
- [x] 3.2 Create `.changeset/README.md` — standard changeset instructions
- [x] 3.3 Create `CHANGELOG.md` with initial 0.1.0 entry

## 4. GitHub Workflows and Templates

- [x] 4.1 Create `.github/workflows/ci.yaml` — checkout, pnpm setup, Node 22, install frozen-lockfile, run `pnpm check`, `pnpm lint`, `pnpm build` on PR and push to main
- [x] 4.2 Create `.github/workflows/release.yaml` — changesets/action for version & publish on main push, GitHub releases, npm + GitHub Packages publishing
- [x] 4.3 Create `.github/pull_request_template.md` — description, checklist (check, lint, fmt, build, changeset), screenshots section
- [x] 4.4 Create `.github/ISSUE_TEMPLATE/config.yml` — disable blank issues, direct to Discussions
- [x] 4.5 Create `.github/ISSUE_TEMPLATE/bug_report.yml` — preflight, summary, expected behavior, steps, version, environment
- [x] 4.6 Create `.github/ISSUE_TEMPLATE/feature_request.yml` — preflight, problem, proposed solution, alternatives

## 5. Push to Remote

- [x] 5.1 Stage all files, create initial commit, push to `main` branch on GitHub
