Status: Ready for Review

# Task 0006 — Diagnostics Catalog and Validator Support

## Agent Mode

Implementation

## Goal

Add the minimal Slice 1 diagnostics catalog and extend catalog validation to cover diagnostics definitions.

## Context

Task 0005 defined Slice 1 diagnostics ownership and recommended a small diagnostics catalog file containing definitions only. This task implements that source-of-truth data and validation support without adding runtime diagnostics, React Flow UI, or production simulation.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- docs/15_Slice_1_Diagnostics_Design.md
- scripts/validate-slice1-catalog.mjs

## In Scope

- Add `catalog/slice1_diagnostics.json` with minimal Slice 1 diagnostic definitions.
- Update catalog loading to include diagnostics definitions.
- Validate diagnostic IDs.
- Validate allowed severities.
- Validate title, message, and repair hints.
- Validate duplicate diagnostic IDs.
- Add a validation script self-test proving malformed diagnostics are caught.

## Out of Scope

- No runtime diagnostic emission.
- No React Flow UI changes.
- No production simulation.
- No graph editing implementation.
- No localization system.
- No scripting language for diagnostic conditions.
- No full diagnostics framework.
- No new dependencies.
- No new machines, resources, recipes, or objectives.

## Required Behavior

- Diagnostics catalog must contain definitions only, not executable conditions.
- Validator must remain dependency-free.
- Validator must keep production validation outside React components.
- Implementation must preserve Slice 1 scope.
- Diagnostic severities must stay limited to `blocking`, `warning`, and `info`.

## Acceptance Criteria

- Diagnostics catalog can be loaded with the rest of the Slice 1 catalog.
- Duplicate diagnostic IDs are detected.
- Missing diagnostic text fields are detected.
- Invalid diagnostic severity is detected.
- Validator self-test covers malformed diagnostics.
- No runtime diagnostics, UI, simulation, or scope expansion occurs.

## Validation

Run:

```bash
node scripts/validate-slice1-catalog.mjs
node scripts/validate-slice1-catalog.mjs --self-test
```

## Expected Output

- Patch.
- Changed files list.
- Validation command output.
- Acceptance criteria check.

## Stop Conditions

Stop and ask for direction if:

- diagnostics validation requires runtime graph assumptions;
- diagnostics require React Flow-specific data;
- a new dependency is required;
- a full diagnostics framework is needed;
- Slice 1 scope must expand.
