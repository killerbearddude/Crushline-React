Status: Ready for Review

# Task 0018 — Connection Interaction Playtest

## Agent Mode

Review

## Goal

Create a focused local playtest script for Task 0017's minimal player connection interaction.

## Context

Task 0017 added React Flow port handles, compatible connection creation, and incompatible connection diagnostic feedback. Before adding machine placement or broader graph editor behavior, the director should validate that compatible and incompatible connection attempts work locally.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- tasks/0017_minimal_player_connection_interaction.md
- src/App.jsx
- src/styles.css
- src/domain/portCompatibility.mjs
- src/domain/localDiagnostics.mjs

## In Scope

- Add a focused playtest artifact under `notes/`.
- Include exact local validation commands.
- Include compatible connection attempt checks.
- Include incompatible connection attempt checks.
- Include regression checks for repair buttons, objective completion, node dragging, and reset.
- Recommend the next bounded task only after validation.

## Out of Scope

- No code implementation.
- No claimed browser execution from the connector.
- No machine placement.
- No connection deletion.
- No save/load or persistence.
- No broad graph editor behavior.
- No UI redesign from the reference image.

## Acceptance Criteria

- A focused connection playtest artifact exists under `notes/`.
- The artifact separates expected and observed results.
- The artifact includes pass/fail fields for Task 0017 acceptance criteria.
- The artifact identifies whether to proceed, revise, or split follow-up work.

## Validation

Review the generated artifact. Execute it locally outside the connector before marking the focused playtest complete.

## Stop Conditions

Stop if this requires claiming browser execution that was not actually performed or if findings require non-Slice-1 scope expansion.
