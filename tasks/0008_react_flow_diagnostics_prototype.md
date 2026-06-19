Status: Accepted

# Task 0008 — React Flow Diagnostics Prototype Shell

## Agent Mode

Implementation

## Goal

Add the smallest React Flow prototype shell that can present existing local diagnostics without moving production meaning into the renderer.

## Context

Slice 1 requires responsive graph interaction, typed ports, invalid connection rejection, local diagnostics, graph repair, and dirty water clarity. The repository now contains renderer-independent catalog loading, typed port compatibility, diagnostics definitions, and local runtime diagnostics. The repo does not yet contain a React/Vite/React Flow app scaffold, so diagnostics presentation cannot be connected safely without first adding the minimal active-stack shell.

## Source-of-Truth Files

- docs/00_Project_Brief.md
- docs/03_Slice_1_Target.md
- docs/04_Technical_Architecture.md
- docs/05_Production_Domain_Model.md
- docs/06_Agent_Rules.md
- docs/08_Decision_Log.md
- docs/09_Drift_Guard.md
- docs/13_Current_Project_Status.md
- docs/15_Slice_1_Diagnostics_Design.md
- catalog/slice1_diagnostics.json
- src/domain/localDiagnostics.mjs

## In Scope

- Add a minimal Vite React app scaffold.
- Add React Flow as the active graph renderer dependency.
- Render a small static Slice 1 graph view.
- Present diagnostic definitions and active diagnostic instances from `src/domain/localDiagnostics.mjs`.
- Keep domain meaning in catalog/domain helpers, not React components.
- Update source-of-truth status and decision log for the concrete prototype shell.

## Out of Scope

- No production simulation.
- No graph editing persistence.
- No save/load.
- No objective completion logic.
- No graph repair implementation beyond visible diagnostic presentation.
- No desktop packaging.
- No stack migration.
- No late-game systems.

## Required Behavior

- The app must consume existing catalog/domain data.
- The app must show local diagnostics without owning diagnostic condition logic.
- The app must remain a prototype shell, not a full game implementation.
- Added dependencies must be limited to the active React Flow prototype path.

## Acceptance Criteria

- `npm run dev` starts a Vite React app.
- The app renders a static Slice 1 graph with React Flow.
- The app displays active local diagnostics from the domain helper.
- Dirty water blockage appears in UI text from diagnostics data.
- Invalid connection diagnostics appear in UI text from diagnostics data.
- Production meaning remains outside React components.
- No Slice 1 scope expansion occurs.

## Validation

Run:

```bash
npm install
npm run build
node scripts/validate-slice1-catalog.mjs
node scripts/check-slice1-local-diagnostics.mjs
```

## Expected Output

- Patch.
- Changed files list.
- Validation notes.
- Acceptance criteria check.

## Stop Conditions

Stop and ask for direction if:

- a full React app architecture is required;
- React Flow cannot be added without broader dependency decisions;
- production simulation is required;
- graph editing or persistence is required;
- Slice 1 scope must expand.
