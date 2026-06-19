# Task 0011 — Slice 1 Playtest Checklist Review

## Summary

This is a source review against `docs/10_Test_and_Playtest_Checklist.md`, not a manual local playtest. The current prototype proves useful Slice 1 scaffolding for diagnostics, graph repair feedback, and objective feedback, but it does not yet prove the full playable Slice 1 loop.

## Source Files Reviewed

- `docs/00_Project_Brief.md`
- `docs/03_Slice_1_Target.md`
- `docs/04_Technical_Architecture.md`
- `docs/05_Production_Domain_Model.md`
- `docs/06_Agent_Rules.md`
- `docs/09_Drift_Guard.md`
- `docs/10_Test_and_Playtest_Checklist.md`
- `docs/13_Current_Project_Status.md`
- `src/App.jsx`
- `src/domain/portCompatibility.mjs`
- `src/domain/localDiagnostics.mjs`
- `src/domain/objectiveProgress.mjs`

## Checklist Review

### Graph Interaction

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Can the player place a machine? | Not proven | Current graph machines are predefined in `initialPrototypeGraph`; there is no placement interaction. |
| Can the player move a machine? | Partial | React Flow nodes can likely be dragged by default, but positions are regenerated from static `nodePositions`, so movement is not owned by app state and is not a designed interaction yet. |
| Can the player connect compatible ports? | Partial | Domain compatibility exists, and UI repair buttons add compatible connections, but there is no player drag-to-connect flow. |
| Are incompatible ports rejected? | Partial | The initial invalid connection produces an `invalid_connection` diagnostic, but there is no attempted player connection flow that rejects new incompatible connections. |
| Is the rejection understandable? | Proven for prototype case | Diagnostic copy, reasons, and repair hints are displayed for the initial invalid connection case. |
| Can the player delete or repair a connection? | Partial | Repair buttons replace/add prototype connections; delete is not implemented and repair is not a generic connection interaction. |

### Production

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Does iron ore enter the crusher? | Not proven | No production simulation or resource movement exists. |
| Does the crusher produce crushed iron ore? | Not proven | Recipes are cataloged, but no evaluator runs production. |
| Does the washer accept crushed iron ore and water? | Not proven | Catalog data exists, but no production evaluator confirms this path. |
| Does the washer produce washed iron ore? | Not proven | No production simulation exists. |
| Does the washer produce dirty water? | Partial | Dirty Water blockage is represented diagnostically for the washer output, but production of Dirty Water is not simulated. |
| Does blocked dirty water stop or warn correctly? | Partial | `dirty_water_output_blocked` emits a blocking diagnostic, but no production is running to stop. |
| Does connecting dirty water handling resume production? | Partial | Connecting Dirty Water handling clears the diagnostic; production does not yet resume because production does not run. |
| Does the final output complete the objective? | Partial | Objective completion helper validates progress data and UI can record Basic Iron Output, but final output is not produced automatically by graph production. |

### Diagnostics

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Are errors local? | Proven for current cases | Invalid connection targets a connection attempt; Dirty Water blockage targets washer `dirty_water_output`. |
| Does the diagnostic identify the machine or port? | Proven for Dirty Water, partial for invalid connection | Dirty Water targets a machine and port. Invalid connection targets the attempted ports but the UI currently displays only target kind. |
| Does the diagnostic suggest a repair action? | Proven | Diagnostic catalog includes repair hints and UI provides repair buttons for current prototype cases. |
| Does the diagnostic disappear when fixed? | Proven for current cases | Repair buttons mutate graph state; diagnostics clear through `diagnoseLocalGraph`. |

### Performance / Feel

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Does dragging feel responsive? | Not reviewed | Requires local manual playtest. |
| Does connecting ports feel reliable? | Not proven | Drag-to-connect is not implemented. |
| Does the graph remain readable? | Partial | Static four-node layout is readable by source inspection, but manual playtest is still needed. |
| Does successful production have visible feedback? | Not proven | No production simulation or production success feedback exists. |
| Does objective completion feel clear? | Partial | Objective panel and completion message exist; feel requires local playtest. |

### Regression Checks

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Existing valid graph still works. | Partial | Domain scripts cover compatibility, diagnostics, and objectives. UI build/playtest still required locally. |
| Existing invalid graph still reports useful diagnostics. | Proven for scripted cases | Local diagnostics script covers invalid connection and Dirty Water blockage. |
| No new unapproved machines were added. | Proven by source review | No catalog machine expansion in recent tasks. |
| No new unapproved resources were added. | Proven by source review | No catalog resource expansion in recent tasks. |
| Production logic remains outside renderer components. | Partial | Compatibility, diagnostics, and objective evaluation are domain helpers. However, there is not yet a production evaluator to assess. |

## Blocking Gaps

1. **No player-driven machine placement.** Machines are predefined in `initialPrototypeGraph`.
2. **No player-driven port connection flow.** Repair buttons prove state changes, but not actual compatible/incompatible connection attempts.
3. **No production evaluator.** Catalog recipes exist, but resources do not flow through crusher, washer, sink, or processor.
4. **Objective completion is prototype-recorded, not production-derived.** This is acceptable for Task 0010 scope but not enough for Slice 1 acceptance.
5. **Manual local playtest still required.** Build and feel checks cannot be completed by source review alone.

## Drift Check

No new machines, resources, recipes, objectives, desktop stack, persistence layer, automation system, or late-game systems are recommended here. The review keeps next work focused on Slice 1 acceptance gaps.

## Recommended Next Task

**Task 0012 — Minimal Runtime Graph Production Evaluator**

Goal: Add the smallest renderer-independent evaluator that can determine whether the current prototype graph satisfies the Basic Iron route enough to derive objective progress from graph state instead of manual buttons.

Recommended scope:

- consume existing catalog/resources/machines/recipes/objectives;
- consume a small runtime graph shape;
- validate that required recipe connections exist for the Slice 1 route;
- produce progress facts such as `completed_recipes.sink_dirty_water` and `produced_resources.basic_iron_output`;
- keep evaluator independent of React Flow;
- add Node validation cases.

Explicit non-scope:

- no throughput;
- no buffers;
- no scheduling;
- no time simulation;
- no inventory UI;
- no drag-to-connect UI;
- no persistence.

## Decision Recommendation

**Accept Task 0011 with Notes.**

The current prototype is strong enough to justify the next production-domain task, but Slice 1 is not yet playably complete. The next implementation should close the largest source-of-truth gap: objective progress must come from production/evaluator facts rather than manual UI progress buttons.
