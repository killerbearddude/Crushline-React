Status: Approved

# Task 0002 — Review and Refine Slice 1 Production Catalog

## Agent Mode

Design

## Goal

Review and refine the initial Slice 1 production catalog drafts for resources, machines, recipes, and objectives.

## Context

Slice 1 proves the minimum playable production graph:

```text
generator
→ crusher
→ washer
→ dirty water handling
→ basic iron output
→ objective completion
```

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/05_Production_Domain_Model.md
- docs/09_Drift_Guard.md
- catalog/slice1_resources.json
- catalog/slice1_machines.json
- catalog/slice1_recipes.json
- catalog/slice1_objectives.json

## In Scope

- Review Slice 1 catalog shape.
- Identify missing references or inconsistencies.
- Recommend small corrections.
- Keep catalog limited to Slice 1.

## Out of Scope

- No gases.
- No advanced chemistry.
- No Closed-Line Certification.
- No large material catalog.
- No machine upgrades.
- No automation.
- No multiple victory routes.
- No implementation code.

## Required Design Rules

- Use stable IDs separate from display names.
- Use tags for resource roles.
- Do not use one exclusive resource-role enum.
- Keep the catalog small.
- Make dirty water create a clear graph problem.
- Keep production logic renderer-independent.

## Acceptance Criteria

- Catalog includes only Slice 1 content.
- Every recipe input and output references a defined resource.
- Every recipe references a defined machine class.
- Dirty water must be handled somehow.
- Objective can be completed using only Slice 1 catalog content.
- No late-game content appears.

## Expected Output

- Catalog review memo.
- Proposed JSON patches if needed.
- Open questions for director.
