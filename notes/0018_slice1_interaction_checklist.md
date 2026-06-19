# Task 0018 — Slice 1 Interaction Checklist Pass

## Summary

This is a source review plus director-reported validation checkpoint after Task 0017. Task 0017's manual tests passed, so compatible and incompatible player connection attempts are considered accepted for current Slice 1 prototype purposes.

This review does not start UI redesign work. The uploaded UI reference remains reference only until a repo source-of-truth decision captures it.

## Source Files Reviewed

- `docs/00_Project_Brief.md`
- `docs/03_Slice_1_Target.md`
- `docs/04_Technical_Architecture.md`
- `docs/05_Production_Domain_Model.md`
- `docs/09_Drift_Guard.md`
- `docs/10_Test_and_Playtest_Checklist.md`
- `docs/13_Current_Project_Status.md`
- `src/App.jsx`
- `src/domain/portCompatibility.mjs`
- `src/domain/localDiagnostics.mjs`

## Evidence Used

- Task 0015 local interaction and diagnostic readability fixes were accepted.
- Task 0017 manual tests passed per director report.
- Source review confirms React Flow remains the UI layer and domain helpers own compatibility and diagnostic logic.

## Graph Interaction Checklist

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Can the player place a machine? | Not proven | Machines remain predefined in `initialPrototypeGraph`; no build/place interaction exists yet. |
| Can the player move a machine? | Proven | Task 0015 added local node position state and director-reported tests passed. |
| Can the player connect compatible ports? | Proven | Task 0017 added port handles and compatible connection attempts; director-reported tests passed. |
| Are incompatible ports rejected? | Proven | Task 0017 rejects incompatible attempts and does not add invalid graph edges; director-reported tests passed. |
| Is the rejection understandable? | Proven for current prototype | Task 0017 reports invalid connection diagnostics using existing domain helpers; director-reported tests passed. |
| Can the player delete or repair a connection? | Partial | Repair buttons exist for the Slice 1 seeded faults. Generic connection deletion is not implemented. |

## Production / Objective Interaction Checklist

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Does connecting dirty water handling resume production? | Proven for current evaluator model | Dirty Water handling repairs the blocking output and objective completion follows evaluator-derived facts. |
| Does the final output complete the objective? | Proven for current evaluator model | Basic Iron Certification completes from evaluator progress facts after route repair. |
| Does successful production have visible feedback? | Partial | Objective completion is visible, but there is no richer production animation or run feedback. This is acceptable for now unless playtest says otherwise. |

## Diagnostics Checklist

| Checklist item | Status | Evidence / Note |
|---|---|---|
| Are errors local? | Proven for current cases | Invalid connection diagnostics target connection attempts; Dirty Water diagnostics target washer output. |
| Does the diagnostic identify the machine or port? | Proven for current cases | Dirty Water identifies washer output; invalid connection identifies rejected attempt and ports. |
| Does the diagnostic suggest a repair action? | Proven | Diagnostic cards provide repair hints and repair buttons cover seeded faults. |
| Does the diagnostic disappear when fixed? | Proven | Director-reported tests passed for repair flow and connection attempts. |

## Remaining Slice 1 Interaction Gaps

1. **Machine placement is still missing.** This is now the largest remaining explicit Slice 1 interaction requirement.
2. **Generic connection deletion is still missing.** This matters for repair freedom but is less blocking than placement because seeded repair controls still exist.
3. **Graph UI direction is not yet source-of-truth.** The uploaded reference image is useful, but UI redesign should wait until a separate design capture task.
4. **Full route creation from an empty canvas is not yet proven.** The current route starts from a predefined graph.

## Drift Check

Do not start with a broad graph editor. Do not implement the full visual layout from the uploaded reference image yet. Do not add save/load, persistence, throughput, buffers, scheduling, inventory, new catalog content, or desktop packaging.

## Recommended Next Task

**Task 0019 — Minimal Machine Placement Interaction**

Goal:

Let the player place one existing Slice 1 machine from a fixed list into the current React Flow prototype graph using existing catalog machine IDs.

Recommended scope:

- add a small build control listing existing Slice 1 machines;
- add a selected machine to local graph state with a default position;
- keep placement current-session only;
- preserve node dragging, port handles, diagnostics, evaluator progress, and reset behavior;
- do not add save/load;
- do not add broad graph editor features;
- do not redesign the UI.

Out of scope:

- no new machines;
- no catalog expansion;
- no drag-from-sidebar polish;
- no inventory/cost system;
- no persistence;
- no layout redesign;
- no connection deletion unless separately tasked.

## Decision Recommendation

Accept Task 0018 with notes and proceed to Task 0019 — Minimal Machine Placement Interaction.
