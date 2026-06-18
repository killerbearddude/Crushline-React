# Single Runner Process

## Purpose

This file defines the simplified ChatGPT Project operating process for Crushline.

The director should not need to manually route work across many standing threads. The repository contains the current project state, task packets, source-of-truth files, and status records. A ChatGPT Project thread should be able to read the repo and proceed with the next task.

## Director Command

The normal director command is:

```text
Proceed with next task.
```

When the director says this, the assistant must use the GitHub connector to inspect the repository, determine the current approved task, execute only that task, and prepare a reviewable PR when repo changes are needed.

## Source of Truth

The GitHub repository is the durable source of truth.

If it matters, it belongs in the repo.

If it is only in chat, it is not project law.

## Required Files to Read First

When the director says `Proceed with next task`, read these files from the repo:

```text
docs/13_Current_Project_Status.md
docs/00_Project_Brief.md
docs/03_Slice_1_Target.md
docs/04_Technical_Architecture.md
docs/05_Production_Domain_Model.md
docs/06_Agent_Rules.md
docs/09_Drift_Guard.md
```

Then read the current task file named in `docs/13_Current_Project_Status.md`.

If the current task references additional source-of-truth files, read those too.

## Task Status Meanings

Use these task statuses:

```text
Proposed
Approved
In Progress
In Review
Accepted
Rejected
Superseded
```

Only run tasks with status `Approved` unless the director explicitly instructs otherwise.

## Default Proceed Loop

When asked to proceed:

1. Read `docs/13_Current_Project_Status.md`.
2. Identify the current task ID, title, and status.
3. Read the matching task packet from `tasks/`.
4. Confirm the task status is `Approved`.
5. Read all source-of-truth files listed in the task.
6. Determine task mode:
   - Research;
   - Design;
   - Implementation;
   - Review;
   - Handoff;
   - Source-of-truth maintenance.
7. Execute only the approved task.
8. Do not expand scope.
9. If repo files need changes, create a branch and PR.
10. In the PR, include what changed, why, validation, and the next expected task.
11. Stop after creating the PR and wait for the director to review, squash, and merge.

## Director Review Model

The director should only need to:

1. Tell the Project thread: `Proceed with next task`.
2. Review the PR.
3. Squash and merge if acceptable.
4. Return and say: `Merged. Proceed with next task`.

## Non-Coding Tasks

For design, review, documentation, and catalog-refinement tasks, the assistant may perform the task directly if it can do so from repo files.

If accepted output requires repo changes, the assistant should open a PR with only those changes.

## Coding Tasks

For implementation tasks, the assistant may perform the task directly only if the required tools are available and the task can be completed safely inside the requested scope.

Implementation tasks must obey:

- no unapproved dependencies;
- no stack migration;
- no late-game scope expansion;
- no renderer/domain coupling;
- smallest useful patch;
- validation notes required.

If the implementation task is too large or unsafe to perform directly, the assistant should create a prepared handoff prompt or task-specific branch notes and stop.

## Branch Naming

Use branch names like:

```text
task/0002-slice1-catalog-review
task/0003-catalog-loading-validation
process/update-current-status
```

## PR Requirements

Every PR should include:

```markdown
## Summary

## Scope

## Source-of-Truth Files Used

## Validation

## Drift Check

## Next Step After Merge
```

## Stop Conditions

Stop and ask the director for direction if:

- the current task is not approved;
- the current status file is ambiguous;
- required source-of-truth files are missing;
- the task would require scope expansion;
- the task would require a stack change;
- the task would add an unapproved dependency;
- the task conflicts with the drift guard;
- the task requires credentials or tools that are unavailable.

## Hard Rule

The assistant should not ask the director to manually choose a thread for normal task execution.

The repository defines the next task. The assistant reads the repo, proceeds, opens a PR when needed, and waits for director review.
