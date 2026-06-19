Status: Ready for Review

# Task 0019 — Minimal Machine Placement Interaction

## Agent Mode

Implementation

## Goal

Add minimal current-session machine placement to the React Flow prototype using existing Slice 1 catalog machine IDs.

## Context

Task 0018 identified machine placement as the largest remaining explicit Slice 1 interaction gap. This task adds only a simple placement control and local graph-state update. It must not become a full graph editor or visual redesign.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- notes/0018_slice1_interaction_checklist.md
- src/App.jsx
- src/styles.css
- catalog/slice1_machines.json

## In Scope

- Add a small build control listing existing Slice 1 machines.
- Add the selected machine to local graph state.
- Assign a default runtime ID and default position.
- Render placed machine with existing node/port handle component.
- Preserve node dragging, player connection attempts, diagnostics, evaluator progress, and reset behavior.

## Out of Scope

- No new catalog machines.
- No drag-from-sidebar placement polish.
- No inventory, costs, or unlock logic.
- No save/load or persistence.
- No generic deletion.
- No broad graph editor features.
- No visual redesign based on reference image.

## Acceptance Criteria

- Player can place an existing Slice 1 machine from a fixed control.
- Placed machine appears on the graph with catalog-driven port handles.
- Placed machine can be dragged during the current session.
- Reset restores the initial prototype graph and removes placed machines.
- Existing connection, diagnostic, repair, evaluator, and objective flows still work.
- No Slice 1 scope expansion occurs.

## Validation

Run:

```bash
npm run build
npm run validate:catalog
npm run check:ports
npm run check:diagnostics
npm run check:objectives
npm run check:evaluator
```

Also manually place a machine, drag it, attempt at least one connection, and reset.

## Stop Conditions

Stop if this requires persistence, inventory/costs, drag-from-sidebar polish, generic deletion, a broad graph editor, new catalog content, UI redesign, or non-Slice-1 scope.
