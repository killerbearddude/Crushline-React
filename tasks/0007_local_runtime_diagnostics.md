Status: Accepted

# Task 0007 — Local Runtime Diagnostics

## Agent Mode

Implementation

## Goal

Add renderer-independent runtime diagnostic helpers for invalid connections and dirty water blockage.

## Context

Slice 1 must prove invalid connection rejection, local diagnostics, graph repair, and dirty water pressure. Task 0004 added typed port compatibility. Task 0005 defined diagnostics ownership. Task 0006 added diagnostics catalog definitions and validation. This task connects those pieces with a small domain helper that emits local diagnostic instances without implementing React Flow UI or production simulation.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- docs/15_Slice_1_Diagnostics_Design.md
- catalog/slice1_diagnostics.json
- scripts/validate-slice1-catalog.mjs
- src/domain/portCompatibility.mjs

## In Scope

- Add a renderer-independent local diagnostics helper.
- Emit `invalid_connection` diagnostics from port compatibility failures.
- Emit `dirty_water_output_blocked` diagnostics when a washer Dirty Water output has no handling connection.
- Keep diagnostic instances local to a connection attempt or machine port.
- Include diagnostic definition IDs, severity, target, context, and readable reasons.
- Add a small validation script with failing and repaired cases.

## Out of Scope

- No React Flow UI changes.
- No production simulation.
- No graph editing implementation.
- No buffers or throughput.
- No objective diagnostics implementation.
- No missing-input diagnostics implementation beyond existing catalog definitions.
- No new catalog content.
- No new dependencies.
- No desktop packaging.

## Required Behavior

- Diagnostics must be emitted by domain/evaluator-style helpers, not React components.
- Invalid connection diagnostics must reuse the existing typed port compatibility result.
- Dirty water diagnostics must target the local washer `dirty_water_output` port.
- Diagnostics must disappear when the invalid connection is fixed or dirty water is connected to waste handling.
- Do not hardcode React Flow node or edge shapes.

## Acceptance Criteria

- Invalid connection attempt emits an `invalid_connection` diagnostic.
- Valid connection attempt emits no diagnostic.
- Washer with unhandled dirty water emits `dirty_water_output_blocked`.
- Washer connected to a waste sink emits no dirty water blockage diagnostic.
- Diagnostic instances include local targets and context.
- Logic is outside React components.
- No Slice 1 scope expansion occurs.

## Validation

Run:

```bash
node scripts/validate-slice1-catalog.mjs
node scripts/validate-slice1-catalog.mjs --self-test
node scripts/check-slice1-port-compatibility.mjs
node scripts/check-slice1-local-diagnostics.mjs
```

## Expected Output

- Patch.
- Changed files list.
- Validation command output.
- Acceptance criteria check.

## Stop Conditions

Stop and ask for direction if:

- runtime diagnostics require React Flow-specific assumptions;
- production simulation is required;
- buffers, throughput, or scheduling are required;
- a new dependency is required;
- Slice 1 scope must expand.
