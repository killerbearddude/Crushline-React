Status: Ready for Review

# Task 0004 — Typed Port Compatibility

## Agent Mode

Implementation

## Goal

Implement renderer-independent typed port compatibility checks for Slice 1 catalog ports.

## Context

Slice 1 must prove compatible connections, invalid connection rejection, and typed ports. The production domain must remain independent of React Flow. Task 0003 added catalog loading and validation, so this task may build on the validated Slice 1 catalog data without implementing production simulation.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- catalog/slice1_resources.json
- catalog/slice1_machines.json
- catalog/slice1_recipes.json
- catalog/slice1_objectives.json
- scripts/validate-slice1-catalog.mjs

## In Scope

- Add a renderer-independent port compatibility helper.
- Check source and target machine IDs.
- Check source and target port IDs.
- Require output-to-input direction.
- Check compatible port kind.
- Check resource compatibility using `accepted_resources`, `accepted_states`, and `accepted_tags`.
- Add a small Slice 1 validation script with valid and invalid connection cases.
- Keep implementation dependency-free.

## Out of Scope

- No React Flow UI changes.
- No graph editing implementation.
- No production simulation.
- No diagnostics schema.
- No new catalog content.
- No new dependencies.
- No save/load.
- No desktop packaging.

## Required Behavior

- Return clear compatibility results with readable error messages.
- Do not hardcode Slice 1 machine IDs into the domain helper.
- Keep compatibility logic outside React components.
- Keep resource roles tag-compatible; do not replace catalog tags with brittle enums.
- Treat the current catalog as data input, not implementation law hardcoded into the checker.

## Acceptance Criteria

- Valid Slice 1 connections pass compatibility checks.
- Invalid direction connections fail.
- Invalid port kind connections fail.
- Invalid resource-to-port connections fail.
- Crusher input rejects processed ore by resource compatibility.
- Compatibility logic is not implemented inside React components.
- No Slice 1 scope expansion occurs.

## Validation

Run:

```bash
node scripts/validate-slice1-catalog.mjs
node scripts/validate-slice1-catalog.mjs --self-test
node scripts/check-slice1-port-compatibility.mjs
```

## Expected Output

- Patch.
- Changed files list.
- Validation command output.
- Acceptance criteria check.

## Stop Conditions

Stop and ask for direction if:

- compatibility requires React Flow-specific edge or handle assumptions;
- production simulation is needed;
- catalog schema changes are required;
- a new dependency is required;
- Slice 1 scope must expand;
- implementation requires a broad refactor.
