Status: Ready for Review

# Task 0017 — Minimal Player Connection Interaction

## Agent Mode

Implementation

## Goal

Add the smallest React Flow interaction that lets the player attempt a connection and receive compatible or incompatible feedback using existing domain helpers.

## Context

Task 0016 accepted the focused node movement and diagnostic readability fixes. Slice 1 still needs compatible and incompatible player connection attempts. This task adds only minimal connection interaction, not machine placement or a broad graph editor.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- notes/0016_focused_interaction_playtest.md
- src/App.jsx
- src/domain/portCompatibility.mjs
- src/domain/localDiagnostics.mjs
- catalog/slice1_machines.json

## In Scope

- Add visible port handles to the existing prototype machines.
- Let the player drag from one port handle to another.
- Add compatible connection attempts to the prototype graph.
- Reject incompatible attempts and show local diagnostic feedback.
- Keep existing repair/evaluator/objective flow working.

## Out of Scope

- No machine placement.
- No save/load or persistence.
- No generic connection deletion.
- No broad graph editor features.
- No throughput, buffers, scheduling, inventory, new dependencies, catalog expansion, or visual redesign.

## Acceptance Criteria

- Player can attempt a compatible connection through React Flow handles.
- Compatible attempt adds a connection to local graph state.
- Incompatible attempt does not add a graph connection.
- Incompatible attempt shows local diagnostic feedback from existing domain diagnostics.
- Existing repair buttons and objective completion still work.
- Production and evaluator logic remain outside React components.

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

Also manually test one compatible and one incompatible connection attempt in the browser.

## Stop Conditions

Stop if this requires machine placement, persistence, connection deletion, broad editor behavior, new dependencies, production simulation expansion, or Slice 1 scope expansion.
