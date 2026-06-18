# Decision Log

Record important project decisions here.

## Format

```markdown
## YYYY-MM-DD — Decision Title

### Decision

[What was decided]

### Context

[Why the decision came up]

### Options Considered

1. [Option]
2. [Option]

### Reasoning

[Why this option was chosen]

### Consequences

[What this enables or prevents]

### Revisit Trigger

[When to reconsider]
```

## Decisions

## 2026-06-18 — Repository Is Source of Truth

### Decision

The GitHub repository is the durable source of truth for Crushline project process, design direction, task packets, catalog drafts, and status tracking.

### Context

The project will be administered through ChatGPT Project threads and coding agents. Uploaded chat files can drift from the repo, so project law must live in version-controlled files.

### Options Considered

1. Keep control files uploaded to ChatGPT Project only.
2. Keep control files in the repository and access them through the GitHub connector.

### Reasoning

Repository files are versioned, reviewable, diffable, and updateable through normal development workflow.

### Consequences

ChatGPT Project threads should read current source-of-truth files from the repo. If a decision matters, it must be reflected in a repo file.

### Revisit Trigger

Revisit only if GitHub connector access becomes unreliable.

## 2026-06-18 — React Flow Prototype Remains Active Path

### Decision

React Flow remains the active prototype path until Slice 1 playability is stable or the director explicitly changes direction.

### Context

Stack decisions around Tauri, Electron, CEF, Godot, or C++ backend remain open, but moving stacks before Slice 1 creates risk.

### Reasoning

The current priority is proving the playable graph loop, not final desktop packaging.

### Consequences

Agents must not migrate stacks unless given an explicit stack-evaluation or migration task.

### Revisit Trigger

Revisit after Slice 1 is playable or if React Flow blocks Slice 1 acceptance criteria.

## 2026-06-18 — Production Domain Must Be Renderer-Independent

### Decision

Production logic must not be owned by React Flow or any specific renderer.

### Context

The graph UI may change in the future, and a C++ backend remains possible later.

### Consequences

Catalog, evaluator, resources, machines, recipes, and objectives should remain portable.

### Revisit Trigger

Revisit only if a deliberate architecture decision chooses a coupled prototype for speed.
