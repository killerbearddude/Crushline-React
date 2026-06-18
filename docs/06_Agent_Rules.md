# Agent Rules

## Prime Directive

Do the assigned task. Do not expand the game.

## Required Behavior

Every agent must:

1. Read the task packet.
2. Identify the source-of-truth files used.
3. State assumptions.
4. Stay within scope.
5. Make the smallest useful change.
6. Preserve Slice 1.
7. Avoid unapproved dependencies.
8. Avoid renderer/domain coupling.
9. Provide validation steps.
10. List changed files.

## Forbidden Behavior

Agents must not:

- redesign the game without permission;
- add new machines beyond the task;
- add new resources beyond the task;
- add new architecture layers beyond the task;
- switch stacks;
- introduce Tauri, Electron, CEF, Godot, or another shell without approval;
- hardcode production logic into React components;
- replace the data model with brittle enums;
- implement late-game systems during Slice 1;
- silently change acceptance criteria;
- perform broad refactors during feature tasks.

## Required Agent Response Format

For implementation tasks, agents must respond with:

```markdown
## Task Summary

## Source Files Consulted

## Assumptions

## Changes Made

## Files Changed

## Validation Performed

## Acceptance Criteria Check

## Risks / Follow-Up
```

## Patch Size Rule

Prefer small patches.

If the task requires broad changes, the agent must stop and propose a task split.
