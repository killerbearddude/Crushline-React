Status: Ready for Review

# Task 0020 — Full Slice 1 Interaction Playtest

## Agent Mode

Review

## Goal

Create a full local playtest script and findings template for the current Slice 1 React Flow prototype.

## Context

Tasks 0015 through 0019 added node movement, diagnostic readability, player connection attempts, interaction review, and minimal machine placement. This is a review checkpoint before deciding whether Slice 1 needs final interaction fixes.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/10_Test_and_Playtest_Checklist.md
- docs/13_Current_Project_Status.md
- src/App.jsx
- src/domain/portCompatibility.mjs
- src/domain/localDiagnostics.mjs
- src/domain/runtimeGraphEvaluator.mjs
- src/domain/objectiveProgress.mjs

## In Scope

- Add a full local playtest artifact under `notes/`.
- Include setup and validation commands.
- Cover graph interaction, production/evaluator, diagnostics, feel, and regression checks.
- Identify how findings should convert into the next bounded task.

## Out of Scope

- No implementation, UI redesign, persistence, deletion, inventory, costs, unlock logic, new catalog content, or broad editor scope.

## Acceptance Criteria

- A full playtest artifact exists under `notes/`.
- The artifact separates expected and observed results.
- The artifact covers every checklist category from `docs/10_Test_and_Playtest_Checklist.md`.
- The artifact gives clear decision options after local execution.

## Validation

Review the generated artifact and execute it locally before marking the full playtest complete.

## Stop Conditions

Stop if this requires implementation, unperformed browser claims, or non-Slice-1 design decisions.
