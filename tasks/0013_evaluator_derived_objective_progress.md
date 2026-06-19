Status: Ready for Review

# Task 0013 — Evaluator-Derived Objective Progress

## Agent Mode

Implementation

## Goal

Connect the React Flow prototype objective panel to runtime evaluator progress facts instead of manual objective-progress buttons.

## Context

Task 0012 added a renderer-independent runtime graph evaluator. The prototype still records objective progress manually. This task should consume evaluator output in the UI while keeping production logic outside React components.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- src/App.jsx
- src/domain/runtimeGraphEvaluator.mjs
- src/domain/objectiveProgress.mjs

## In Scope

- Import and use `evaluateRuntimeGraph` in `src/App.jsx`.
- Remove manual objective-progress state and buttons.
- Derive Basic Iron Certification progress from evaluator progress facts.
- Keep prototype graph repair buttons as the way to complete the route.
- Add only the minimal static route data needed for the evaluator to derive objective progress.

## Out of Scope

- No drag-to-connect UI.
- No placement UI.
- No throughput, buffers, scheduling, time simulation, save/load, persistence, new dependencies, or catalog expansion.

## Acceptance Criteria

- Initial prototype objective progress is incomplete.
- Repairing power and Dirty Water handling lets evaluator-derived progress complete Basic Iron Certification.
- Objective buttons for manual progress recording are removed.
- Production/evaluator logic remains outside React components.
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

## Stop Conditions

Stop if this requires a full graph editor, placement UI, drag-to-connect, time simulation, persistence, new dependency, or Slice 1 scope expansion.
