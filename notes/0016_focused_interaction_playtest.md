# Task 0016 — Focused Interaction Playtest

## Purpose

This artifact validates the focused Task 0015 revision before broader player connection interaction work begins.

Task 0015 targeted two local playtest failures:

1. node movement did not work;
2. invalid connection diagnostic was cluttered.

This artifact is a local playtest script and findings template. It does not claim browser execution by the GitHub connector.

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

## Focused Checks

### 1. Node Dragging

Action:

- Drag the Basic Generator node to a new nearby position.
- Drag the Washer node to a new nearby position.

Expected:

- Nodes move smoothly enough for current Slice 1 prototype review.
- Moved nodes stay in the moved position after release.
- Existing edges remain attached to moved nodes.
- Diagnostics and objective panels continue to update normally.

Observed:

- [ ] Pass
- [ ] Fail
- Notes:

### 2. Reset Restores Layout

Action:

- After dragging nodes, click `Reset prototype`.

Expected:

- Nodes return to the initial layout.
- Initial invalid connection diagnostic returns.
- Initial Dirty Water blockage diagnostic returns.
- Basic Iron Certification becomes incomplete.

Observed:

- [ ] Pass
- [ ] Fail
- Notes:

### 3. Invalid Connection Diagnostic Readability

Initial expected diagnostic:

- Title is clear.
- Message explains that the power output cannot connect to the solid input.
- Repair hint is short and actionable.
- Card is less cluttered than the Task 0014 playtest version.

Observed:

- [ ] Pass
- [ ] Fail
- Notes:

### 4. Dirty Water Diagnostic Readability

Action:

- Inspect the Dirty Water diagnostic before using the repair button.

Expected:

- Message still explains that Dirty Water has nowhere to go.
- Repair hint still tells the player to connect Dirty Water Output to a Waste Sink.
- Readability was not harmed by the invalid diagnostic cleanup.

Observed:

- [ ] Pass
- [ ] Fail
- Notes:

### 5. Repair / Evaluator / Objective Flow Regression

Actions:

1. Click `Repair invalid power connection`.
2. Confirm invalid connection diagnostic disappears.
3. Click `Connect Dirty Water to Waste Sink`.
4. Confirm Dirty Water diagnostic disappears.
5. Confirm Basic Iron Certification completes.

Expected:

- Repair buttons still work.
- Runtime evaluator still derives objective progress.
- Basic Iron Certification completion still appears clearly.

Observed:

- [ ] Pass
- [ ] Fail
- Notes:

## Regression Commands

Record local command results:

| Command | Pass/Fail | Notes |
|---|---|---|
| `npm run build` |  |  |
| `npm run validate:catalog` |  |  |
| `npm run check:ports` |  |  |
| `npm run check:diagnostics` |  |  |
| `npm run check:objectives` |  |  |
| `npm run check:evaluator` |  |  |

## Decision

Select one after local execution:

- [ ] Accept Task 0015 focused revision and proceed to minimal player connection interaction.
- [ ] Accept with notes and proceed to minimal player connection interaction.
- [ ] Revise Task 0015 before adding player connection interaction.
- [ ] Split findings into separate tasks.

## Next Task If Accepted

**Task 0017 — Minimal Player Connection Interaction**

Goal:

Add the smallest React Flow interaction that lets the player attempt a connection and receive compatible/incompatible feedback using existing domain compatibility and diagnostics helpers.

Keep out of scope:

- machine placement;
- save/load;
- persistence;
- throughput;
- buffers;
- scheduling;
- inventory;
- broad graph editor features;
- new catalog content;
- visual redesign based on the reference image.

## Notes From Local Run

Date:

Tester:

Environment:

Findings:

1.
2.
3.

Decision:
