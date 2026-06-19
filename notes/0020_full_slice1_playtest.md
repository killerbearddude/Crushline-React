# Task 0020 — Full Slice 1 Interaction Playtest

## Purpose

This artifact is the local full Slice 1 playtest script after minimal machine placement landed. It is a checklist and findings template, not a claim that the playtest has already been run.

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

Open the Vite local URL.

## Expected Slice 1 Prototype Flow

1. Confirm initial graph appears.
2. Place at least one existing Slice 1 machine from the placement control.
3. Drag at least two machines.
4. Attempt one compatible connection.
5. Attempt one incompatible connection.
6. Repair the seeded invalid power connection.
7. Connect Dirty Water to Waste Sink.
8. Confirm diagnostics clear.
9. Confirm Basic Iron Certification completes.
10. Reset prototype and confirm initial graph returns.

## Graph Interaction

| Check | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| Place a machine | Existing catalog machine appears with port handles |  |  |  |
| Move a machine | Dragged node stays moved during current session |  |  |  |
| Connect compatible ports | Compatible edge is added |  |  |  |
| Reject incompatible ports | No invalid edge is added |  |  |  |
| Rejection understandable | Local invalid-connection diagnostic appears |  |  |  |
| Delete or repair connection | Seeded repair controls work; generic delete is not expected yet |  |  |  |
| Reset | Initial graph returns and placed machines are removed |  |  |  |

## Production / Evaluator

| Check | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| Iron route progresses | Evaluator derives route facts from graph state |  |  |  |
| Dirty Water pressure | Dirty Water diagnostic appears until handled |  |  |  |
| Dirty Water repair | Waste Sink handling clears blockage |  |  |  |
| Objective completion | Basic Iron Certification completes after route repair |  |  |  |
| Production feedback clarity | Objective completion is visible and understandable |  |  |  |

## Diagnostics

| Check | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| Errors are local | Diagnostic points to relevant machine, port, or rejected attempt |  |  |  |
| Machine or port identified | Diagnostic target is understandable |  |  |  |
| Repair action suggested | Repair hint is actionable |  |  |  |
| Diagnostic disappears | Diagnostic clears when fixed |  |  |  |
| Multiple diagnostics readable | Panel remains understandable with more than one issue |  |  |  |

## Performance / Feel

| Check | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| Dragging responsive | Node dragging feels responsive enough to continue |  |  |  |
| Connecting reliable | Port connection attempts feel reliable enough to continue |  |  |  |
| Graph readable | Current layout remains understandable after placement and dragging |  |  |  |
| Objective clear | Completion state is obvious |  |  |  |
| Side panel usable | Placement, repair, diagnostics, and objective panels are usable |  |  |  |

## Regression Checks

| Check | Expected | Observed | Pass/Fail | Notes |
|---|---|---|---|---|
| Build passes | `npm run build` passes |  |  |  |
| Catalog validation | `npm run validate:catalog` passes |  |  |  |
| Port checks | `npm run check:ports` passes |  |  |  |
| Diagnostic checks | `npm run check:diagnostics` passes |  |  |  |
| Objective checks | `npm run check:objectives` passes |  |  |  |
| Evaluator checks | `npm run check:evaluator` passes |  |  |  |
| No unapproved machines | No new catalog machine content was added |  |  |  |
| No unapproved resources | No new catalog resource content was added |  |  |  |
| Domain separation | Production/evaluator logic remains outside React components |  |  |  |

## Known Non-Goals For This Pass

- Generic connection deletion is not required unless the playtest shows it blocks Slice 1 acceptance.
- Save/load and persistence are not required.
- Inventory, costs, unlocks, and production timing are not required.
- The uploaded UI reference image remains reference only.

## Decision

Select one after local execution:

- [ ] Accept current Slice 1 interaction checkpoint.
- [ ] Accept with notes and proceed to final Slice 1 status review.
- [ ] Revise with one focused implementation task.
- [ ] Split findings into multiple bounded tasks.

## Findings From Local Run

Date:

Tester:

Environment:

Findings:

1.
2.
3.

Decision:
