Status: Ready for Review

# Task 0015 — Prototype Interaction and Diagnostic Readability Fix

## Agent Mode

Implementation

## Goal

Address the focused Task 0014 playtest failures by making prototype node movement work locally and reducing clutter in the invalid connection diagnostic.

## Context

The Task 0014 local playtest passed the repair/evaluator flow but failed machine movement and marked the invalid connection explanation as cluttered. This task revises only those focused issues before broader player connection interaction work.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- notes/0014_local_slice1_playtest_pass.md
- src/App.jsx
- src/styles.css
- catalog/slice1_diagnostics.json

## In Scope

- Make React Flow node dragging update local prototype state.
- Keep moved node positions during the current app session until reset.
- Reset graph should restore the initial layout.
- Simplify invalid connection diagnostic presentation.
- Keep diagnostics derived from existing domain helpers and catalog definitions.

## Out of Scope

- No machine placement.
- No drag-to-connect.
- No generic connection deletion.
- No save/load or persistence beyond current-session React state.
- No throughput, buffers, scheduling, inventory, new dependencies, catalog expansion, or full UI redesign.

## Acceptance Criteria

- Nodes can be dragged and stay where moved during the current session.
- Reset restores the initial node layout.
- Invalid connection diagnostic is less cluttered and has a clear repair hint.
- Dirty Water diagnostic remains understandable.
- Repair/evaluator/objective flow remains unchanged.
- Production and evaluator logic remain outside React components.

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

Also manually confirm node dragging and invalid diagnostic readability in the browser.

## Stop Conditions

Stop if this requires full graph editor behavior, placement, drag-to-connect, persistence, a new dependency, production simulation expansion, or Slice 1 scope expansion.
