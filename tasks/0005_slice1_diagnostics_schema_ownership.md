Status: Ready for Review

# Task 0005 — Slice 1 Diagnostics Schema and Ownership

## Agent Mode

Design

## Goal

Define the minimal Slice 1 diagnostics schema and ownership rules needed to support invalid connection feedback and dirty water blockage clarity.

## Context

Slice 1 must prove local diagnostics, invalid connection rejection, graph repair, and dirty water pressure. The architecture separates the production catalog, runtime graph, evaluator, and UI/renderer. Diagnostics need a small source-of-truth design before implementation so agents do not scatter copy, conditions, and renderer behavior across unrelated files.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/09_Drift_Guard.md
- docs/10_Test_and_Playtest_Checklist.md
- docs/13_Current_Project_Status.md
- scripts/validate-slice1-catalog.mjs
- src/domain/portCompatibility.mjs

## In Scope

- Define diagnostic ownership across catalog, runtime graph, evaluator, and UI.
- Define a minimal diagnostic object shape for Slice 1.
- Define the required Slice 1 diagnostic cases.
- Define how diagnostic copy and repair hints should be represented.
- Define what implementation task should follow.
- Keep the design small and renderer-independent.

## Out of Scope

- No diagnostics implementation code.
- No React Flow UI work.
- No production simulation.
- No new catalog content.
- No new dependencies.
- No full diagnostics framework.
- No advanced chemistry, automation, route medals, Closed-Line Certification, or late-game diagnostics.

## Required Behavior

- Keep diagnostics local to a machine, port, connection, or objective when possible.
- Keep evaluator-owned conditions as stable IDs, not arbitrary script strings.
- Keep player-facing copy data-like and portable.
- Preserve renderer-independent production logic.
- Avoid broad schema commitments beyond Slice 1 needs.

## Acceptance Criteria

- Design identifies diagnostic ownership by layer.
- Design defines a minimal diagnostic shape.
- Design covers invalid connection feedback.
- Design covers dirty water blockage feedback.
- Design covers repair hints and disappearance when fixed.
- Design names the next implementation task.
- No Slice 1 scope expansion occurs.

## Validation

Manual review against:

- Slice 1 target diagnostics requirements;
- technical architecture layer boundaries;
- production domain model diagnostics guidance;
- test and playtest checklist diagnostics section;
- drift guard.

## Expected Output

- Design memo or source-of-truth design file.
- Updated current project status.
- Changed files list.
- Acceptance criteria check.

## Stop Conditions

Stop and ask for direction if:

- diagnostics require new gameplay systems outside Slice 1;
- implementation details require a renderer-specific design;
- schema design requires a broad catalog rewrite;
- a new dependency is required;
- source-of-truth files conflict.
