# Task 0014 — Local Slice 1 Playtest Pass

## Purpose

This artifact defines the local manual playtest pass for the current Slice 1 React Flow prototype. It is a script and findings template, not a claim that the playtest has already been executed.

## Source Files

- `docs/00_Project_Brief.md`
- `docs/03_Slice_1_Target.md`
- `docs/04_Technical_Architecture.md`
- `docs/05_Production_Domain_Model.md`
- `docs/09_Drift_Guard.md`
- `docs/10_Test_and_Playtest_Checklist.md`
- `src/App.jsx`
- `src/domain/localDiagnostics.mjs`
- `src/domain/runtimeGraphEvaluator.mjs`
- `src/domain/objectiveProgress.mjs`

## Local Setup

Run from the repository root:

```bash
git pull origin main
npm install
npm run build
npm run validate:catalog
npm run check:ports
npm run check:diagnostics
npm run check:objectives
npm run check:evaluator
npm run dev
```

Open the local Vite URL printed by `npm run dev`.

## Expected Prototype Flow

### Initial State

Expected:

- Graph displays Basic Generator, Crusher, Washer, Waste Sink, and Basic Processor.
- Local Diagnostics panel shows an invalid power connection diagnostic.
- Local Diagnostics panel shows a Dirty Water blockage diagnostic.
- Basic Iron Certification is incomplete.
- There are no manual objective-progress buttons.

Observed:

- [x] Pass
- [ ] Fail
- Notes:

### Repair Invalid Power Connection

Action:

- Click `Repair invalid power connection`.

Expected:

- Invalid connection diagnostic disappears.
- Dirty Water blockage diagnostic remains.
- Basic Iron Certification remains incomplete.

Observed:

- [x] Pass
- [ ] Fail
- Notes:

### Connect Dirty Water Handling

Action:

- Click `Connect Dirty Water to Waste Sink`.

Expected:

- Dirty Water blockage diagnostic disappears.
- No active diagnostics remain.
- Runtime evaluator derives route progress.
- Basic Iron Certification becomes complete.

Observed:

- [x] Pass
- [ ] Fail
- Notes:

### Reset Prototype

Action:

- Click `Reset prototype`.

Expected:

- Initial diagnostics return.
- Basic Iron Certification becomes incomplete again.
- Graph remains readable.

Observed:

- [x] Pass
- [ ] Fail
- Notes:

## Checklist Findings

### Graph Interaction

| Question | Pass/Fail | Notes |
|---|---|---|
| Can the player move a machine? | Fail |  |
| Does dragging feel responsive? | Fail |  |
| Does the graph remain readable after interaction? | fail  | can not interact |
| Can the player repair the invalid connection through the prototype control? | yes  |  |
| Can the player repair Dirty Water through the prototype control? | yes |  |

Known not-yet-proven items:

- Player-driven machine placement.
- Player drag-to-connect compatible ports.
- Player drag-to-connect incompatible port rejection.
- Generic connection deletion.

### Production / Evaluator Feedback

| Question | Pass/Fail | Notes |
|---|---|---|
| Does fixing the power route allow the evaluator to advance the iron route? |yes  |  |
| Does Dirty Water handling gate Basic Iron completion? |yes  |  |
| Does the final output complete Basic Iron Certification through evaluator facts? |yes  |  |
| Is completion feedback clear without manual objective buttons? | yes |  |

### Diagnostics

| Question | Pass/Fail | Notes |
|---|---|---|
| Are diagnostics local to the relevant issue? |yes  |  |
| Is the invalid connection explanation understandable? | fail | cluttered |
| Is the Dirty Water blockage explanation understandable? | yes |  |
| Do diagnostics disappear when repaired? | yes |  |
| Does the UI clearly show all-clear state? |yes  |  |

### Feel / Readability

| Question | Pass/Fail | Notes |
|---|---|---|
| Is the prototype readable at normal browser size? | yes | could be smaller |
| Is the side panel understandable? | yes |  |
| Are repair buttons discoverable? | yes |  |
| Does objective completion feel clear enough for Slice 1 continuation? | yes |  |

### Regression Checks

| Question | Pass/Fail | Notes |
|---|---|---|
| `npm run build` passes locally. |y  |  |
| Catalog validation passes. | y |  |
| Port compatibility checks pass. | y |  |
| Local diagnostics checks pass. | y |  |
| Objective checks pass. | y |  |
| Runtime evaluator checks pass. | y |  |
| No new machines were added. | y |  |
| No new resources were added. |y  |  |
| Production logic remains outside React components. | y |  |

## Playtest Result

Select one after local execution:

- [ ] Accept current Slice 1 prototype checkpoint.
- [ ] Accept with notes and proceed to the next focused interaction task.
- [x] Revise current prototype before proceeding.
- [ ] Split findings into multiple implementation tasks.

## Recommended Next Task Conversion

If the playtest passes the current prototype controls but confirms the known interaction gaps, create the next implementation task as:

**Task 0015 — Minimal Player Connection Interaction**

Recommended goal:

Add the smallest React Flow interaction that lets the player attempt a connection and receive compatible/incompatible feedback using existing domain compatibility and diagnostics helpers.

Keep out of scope:

- machine placement;
- save/load;
- persistence;
- throughput;
- buffers;
- scheduling;
- broad graph editor features;
- new catalog content.

## Notes From Local Run

Date:

Tester:

Environment:

Findings:

1.
2.
3.

Decision:
