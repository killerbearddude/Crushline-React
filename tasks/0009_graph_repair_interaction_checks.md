Status: Accepted

# Task 0009 — Graph Repair Interaction Checks

## Agent Mode

Implementation

## Goal

Add minimal prototype graph repair interactions that prove diagnostics can disappear when the player fixes invalid connection and dirty water problems.

## Context

Slice 1 must prove local diagnostics, graph repair, invalid connection rejection, dirty water handling, and responsive React Flow interaction. Task 0008 added a minimal React Flow shell that displays domain-generated diagnostics from a static prototype graph. This task should make that prototype graph locally repairable without adding production simulation or persistence.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- docs/15_Slice_1_Diagnostics_Design.md
- src/App.jsx
- src/domain/localDiagnostics.mjs
- src/domain/portCompatibility.mjs

## In Scope

- Keep the prototype graph in local React state.
- Add a repair action for the invalid power-to-solid connection.
- Add a repair action for unhandled dirty water.
- Recompute diagnostics from the existing domain helper after repairs.
- Show when no active diagnostics remain.
- Keep repair interactions local to the prototype shell.

## Out of Scope

- No production simulation.
- No throughput, buffers, or scheduling.
- No save/load or persistence.
- No full graph editor.
- No drag-to-connect implementation.
- No objective completion logic.
- No new dependencies.
- No desktop packaging.
- No stack migration.

## Required Behavior

- Repair buttons must update prototype graph state, not diagnostic state directly.
- Diagnostics must clear only because `diagnoseLocalGraph` returns fewer diagnostics for the repaired graph.
- React components must not own diagnostic condition logic.
- The app must remain a prototype shell.

## Acceptance Criteria

- Initial graph shows invalid connection and dirty water diagnostics.
- Repairing the invalid connection clears the invalid connection diagnostic.
- Connecting dirty water handling clears the dirty water blockage diagnostic.
- When both repairs are applied, the UI shows no active diagnostics.
- React component state tracks graph connections, not production state.
- No Slice 1 scope expansion occurs.

## Validation

Run:

```bash
npm run build
npm run validate:catalog
npm run check:ports
npm run check:diagnostics
```

## Expected Output

- Patch.
- Changed files list.
- Validation notes.
- Acceptance criteria check.

## Stop Conditions

Stop and ask for direction if:

- repair requires a full graph editor;
- repair requires production simulation;
- repair requires persistence;
- a new dependency is required;
- Slice 1 scope must expand.
