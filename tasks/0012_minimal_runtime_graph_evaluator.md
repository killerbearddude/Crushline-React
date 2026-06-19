Status: Ready for Review

# Task 0012 — Minimal Runtime Graph Production Evaluator

## Agent Mode

Implementation

## Goal

Add the smallest renderer-independent evaluator that derives Basic Iron route progress from graph and catalog facts.

## Context

Task 0011 found that objective progress is still prototype-recorded rather than production-derived. This task closes that gap without adding throughput, buffers, scheduling, time simulation, persistence, inventory UI, or drag-to-connect UI.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- notes/0011_slice1_playtest_checklist_review.md
- catalog/slice1_resources.json
- catalog/slice1_machines.json
- catalog/slice1_recipes.json
- catalog/slice1_objectives.json
- src/domain/portCompatibility.mjs
- src/domain/objectiveProgress.mjs

## In Scope

- Add a renderer-independent graph evaluator.
- Consume existing catalog and a small runtime graph shape.
- Determine which Slice 1 recipes are satisfied by graph connections and external inputs.
- Produce objective progress facts such as `completed_recipes.sink_dirty_water` and `produced_resources.basic_iron_output`.
- Add Node validation cases for incomplete and complete route graphs.

## Out of Scope

- No throughput, buffers, scheduling, time simulation, inventory UI, drag-to-connect UI, save/load, persistence, new catalog content, new dependencies, or React UI integration.

## Required Behavior

- Evaluator logic must live outside React components.
- Evaluator must use catalog recipes and port compatibility.
- Complete route graph must derive Basic Iron Certification progress facts.
- Missing Dirty Water handling must not satisfy `sink_dirty_water`.
- Missing processor route must not produce `basic_iron_output`.

## Acceptance Criteria

- Full valid route yields `basic_iron_output` progress and `sink_dirty_water` recipe completion.
- Missing Dirty Water handling leaves Dirty Water recipe incomplete.
- Missing processor route leaves Basic Iron Output incomplete.
- Objective evaluation can consume evaluator progress facts.
- No Slice 1 scope expansion occurs.

## Validation

Run:

```bash
npm run validate:catalog
npm run check:ports
npm run check:diagnostics
npm run check:objectives
npm run check:evaluator
```

## Stop Conditions

Stop if this requires full simulation, buffers, throughput, scheduling, UI integration, persistence, a new dependency, or Slice 1 scope expansion.
