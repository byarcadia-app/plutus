## ADDED Requirements

### Requirement: Code of Conduct file exists

The repository SHALL contain a `CODE_OF_CONDUCT.md` at the project root using Contributor Covenant v2.1. It SHALL include contact information at contact@byarcadia.app.

#### Scenario: Code of Conduct present at root

- **WHEN** a contributor visits the repository
- **THEN** `CODE_OF_CONDUCT.md` exists at the project root with Contributor Covenant v2.1 content

#### Scenario: Contact information included

- **WHEN** a community member reads the Code of Conduct
- **THEN** the enforcement section lists contact@byarcadia.app as the contact email

### Requirement: Security policy file exists

The repository SHALL contain a `SECURITY.md` at the project root with a vulnerability disclosure policy. It SHALL include supported versions, reporting instructions, contact email (contact@byarcadia.app), and expected response timeline.

#### Scenario: Security policy present at root

- **WHEN** a security researcher visits the repository
- **THEN** `SECURITY.md` exists at the project root with disclosure instructions

#### Scenario: Supported versions listed

- **WHEN** a researcher reads the security policy
- **THEN** a supported versions table is present showing current 0.x as supported

#### Scenario: Response timeline documented

- **WHEN** a vulnerability is reported
- **THEN** the policy states an expected acknowledgment and resolution timeline
