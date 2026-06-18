# Director Operating Manual

## Director Role

The director owns:

- game identity;
- scope;
- priorities;
- architecture direction;
- task approval;
- acceptance criteria;
- final review;
- source-of-truth updates.

Agents may propose. Agents may implement. Agents do not silently redirect the project.

## Operating Principle

Agents execute slices. The director controls direction.

## Standard Work Loop

1. Select one approved task.
2. Write or approve a task packet.
3. Give the task packet to an agent.
4. Require assumptions before implementation.
5. Require a small patch.
6. Review the patch against acceptance criteria.
7. Run tests or a playtest checklist.
8. Accept, reject, revise, or split.
9. Update decision log, parking lot, task status, or source files.

## Agent Modes

### Research Agent

Investigates options. Produces a memo only. Does not write code.

### Design Agent

Produces schema, system design, feature behavior, acceptance criteria, or implementation plans. Does not write code unless explicitly authorized.

### Implementation Agent

Writes code for one bounded approved task. Must stay inside scope and report changed files, validation, risks, and acceptance status.

### Review Agent

Reviews agent output against task packet and repo source-of-truth. Recommends accept, revise, reject, or split.

## Director Review Questions

Before accepting work, ask:

1. Did it solve the assigned task?
2. Did it stay within scope?
3. Did it preserve the Slice 1 target?
4. Did it add unapproved systems?
5. Did it couple production logic to the renderer?
6. Did it keep content data-driven?
7. Did it add tests or validation where appropriate?
8. Did it improve playability?
9. Did it introduce drift?

## Commit Rule

One task packet should usually map to one small patch or commit.

If a task grows too large, stop and split it.
