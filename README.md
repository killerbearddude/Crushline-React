# Crushline React

Crushline is a production-graph game prototype. Players build industrial systems by connecting machines, typed ports, resources, waste streams, power, and recovery loops.

## Current Build Target

The active target is **Slice 1**: a small playable React Flow production graph that proves typed ports, basic production flow, dirty-water pressure, local diagnostics, graph repair, and objective completion.

## Project Operating Rule

The repository is the durable source of truth. ChatGPT Project threads and coding agents administer or execute bounded tasks against the files in this repo.

If it matters, it belongs in the repo. If it is only in chat, it is not project law.

## Single Runner Process

The preferred ChatGPT Project command is:

```text
Proceed with next task.
```

A Project thread should read `docs/13_Current_Project_Status.md`, read the approved task packet from `tasks/`, execute only that task, and open a reviewable PR when repo changes are needed.

The director should only need to review, squash, merge, and then say:

```text
Merged. Proceed with next task.
```

See `docs/14_Single_Runner_Process.md` for the detailed operating loop.

## Key Directories

- `docs/` — source-of-truth project, design, process, and review files.
- `catalog/` — data-driven Slice 1 production catalog drafts.
- `tasks/` — director-approved task packets for agents.
- `notes/` — playtest and research notes.
- `handoffs/` — thread and agent handoff artifacts.

## Director Model

Agents execute bounded tasks. The director owns scope, architecture, acceptance criteria, and final decisions.
