Status: Accepted

# Task 0010 — Objective Completion Feedback

## Agent Mode

Implementation

## Goal

Add renderer-independent objective progress evaluation and minimal UI feedback for Basic Iron Certification.

## Context

Slice 1 must prove objective completion after graph repair and Dirty Water handling. The objective catalog defines `basic_iron_certification` with `basic_iron_output` and `sink_dirty_water` requirements. This task adds feedback only; it does not add production simulation.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- catalog/slice1_objectives.json
- catalog/slice1_recipes.json
- src/App.jsx

## In Scope

- Add a small domain objective-progress helper.
- Evaluate `produced_resource` and `completed_recipe` requirements from catalog data.
- Add a validation script for incomplete, partial, and complete progress.
- Show objective progress in the prototype UI.
- Let the prototype record progress through explicit buttons.

## Out of Scope

- No production simulation.
- No throughput, buffers, scheduling, save/load, persistence, quest tree, new content, new dependencies, or desktop packaging.

## Required Behavior

- Objective evaluation must live outside React components.
- React may hold prototype progress state only.
- Requirement checks must use catalog objective data.
- Scope stays limited to Slice 1 Basic Iron Certification.

## Acceptance Criteria

- Empty progress is incomplete.
- Only Dirty Water sink progress is incomplete.
- Only Basic Iron Output progress is incomplete.
- Both requirements complete the objective.
- UI shows progress and completion state.

## Validation

Run:

```bash
npm run build
npm run validate:catalog
npm run check:ports
npm run check:diagnostics
npm run check:objectives
```

## Stop Conditions

Stop if this requires simulation, persistence, a broader quest tree, a new dependency, or Slice 1 scope expansion.
