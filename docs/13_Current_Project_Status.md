# Crushline Current Project Status

## Active Build Target

Slice 1: Basic iron production graph with typed ports, dirty water pressure, diagnostics, graph repair, and objective completion.

## Active Stack

React Flow prototype.

## Current Phase

Task 0005 diagnostics design ready for review.

## Current Task

Task ID: 0005

Task Title: Slice 1 Diagnostics Schema and Ownership

Status: Ready for Review

## Last Accepted Task

Task ID: 0004

Summary: Added renderer-independent typed port compatibility checks and Slice 1 compatibility validation cases.

Commit: PR #7.

## Next Candidate Tasks

1. Review Task 0005 diagnostics schema and ownership design.
2. After acceptance, add minimal diagnostics catalog and validator support.
3. After diagnostics catalog support, implement local diagnostics for invalid connections and dirty water blockage.

## Current Blockers

- Task 0005 requires director review before acceptance.

## Active Decisions

- Repository is source of truth.
- React Flow remains active prototype path.
- Production domain must remain renderer-independent.
- Slice 1 catalog corrections accepted for Task 0002:
  - crusher input accepts only `iron_ore`;
  - Basic Iron Certification requires completing `sink_dirty_water`.
- Slice 1 catalog validation accepted for Task 0003.
- Renderer-independent typed port compatibility accepted for Task 0004.

## Drift Risks

- Premature desktop stack decision.
- Adding late-game materials before Slice 1.
- Coupling production logic directly to React Flow components.
- Letting diagnostics design become full diagnostics framework.
- Adding React Flow-specific diagnostic state before domain ownership is clear.

## Parking Lot Highlights

- Desktop shell decision.
- Full Closed-Line Certification implementation.

## Next Director Action

Review Task 0005 diagnostics schema and ownership design.
