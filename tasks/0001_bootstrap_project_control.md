Status: Accepted

# Task 0001 — Bootstrap Project Control Files

## Agent Mode

Implementation

## Goal

Create the initial repo-based project control file structure for Crushline.

## Context

Crushline will be developed with agents, but the director owns scope, architecture, and acceptance. The first task is not gameplay implementation. The first task is creating the source-of-truth files that prevent project drift.

## Source-of-Truth Files

None yet. This task creates them.

## In Scope

- Create `/docs` source-of-truth files.
- Create `/catalog` Slice 1 catalog drafts.
- Create `/notes` files.
- Create `/tasks` files.
- Create `/handoffs` seed file.
- Update README with the operating model.

## Out of Scope

- Do not implement gameplay.
- Do not install dependencies.
- Do not choose a desktop shell.
- Do not create React components.
- Do not add machines, resources, or recipes beyond Slice 1 draft content.

## Acceptance Criteria

- Required folders exist.
- Required control files exist.
- Slice 1 catalog drafts exist.
- No gameplay code is added.
- No dependencies are added.
- The project can be reviewed as a clean control-file baseline.

## Validation

- List created files.
- Confirm no source code implementation was added.
- Confirm no dependency files were modified.

## Expected Output

- Pull request or branch containing bootstrap files.
- Summary of files changed.
- Any risks or follow-up tasks.

## Stop Conditions

Stop if implementation requires gameplay code, stack migration, dependency installation, or architecture restructuring.

## Result

Accepted after PR #1 was merged.
