Status: Accepted

# Task 0003 — Catalog Loading and Validation

## Agent Mode

Implementation

## Goal

Load the Slice 1 catalog and validate basic resource, machine, port, recipe, and objective references.

## Context

Crushline production content should be data-driven. Before implementing gameplay behavior, the project needs to prove that the Slice 1 catalog can be loaded and checked.

## Source-of-Truth Files

- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- catalog/slice1_resources.json
- catalog/slice1_machines.json
- catalog/slice1_recipes.json
- catalog/slice1_objectives.json

## In Scope

- Define TypeScript types or equivalent runtime structures for Slice 1 catalog data.
- Load the four Slice 1 catalog files.
- Validate that resource references exist.
- Validate that machine references exist.
- Validate recipe machine classes against machine catalog classes.
- Report clear validation errors.
- Add a basic test or validation script if practical.

## Out of Scope

- Do not implement full production simulation.
- Do not implement React Flow UI changes.
- Do not add new catalog content.
- Do not add new dependencies unless explicitly approved.
- Do not build save/load.
- Do not implement desktop packaging.

## Acceptance Criteria

- Catalog can be loaded.
- Invalid missing resource references are detected.
- Invalid missing machine class references are detected.
- Validation errors are readable.
- Production validation is not implemented inside React components.
- No Slice 1 scope expansion occurs.

## Expected Output

- Patch.
- Changed files list.
- Validation command.
- Acceptance criteria check.
