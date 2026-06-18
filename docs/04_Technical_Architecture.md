# Technical Architecture

## Current Architecture Rule

The production domain must be independent of the renderer.

React Flow may be used for graph interaction and display, but it must not own production meaning.

## Architecture Layers

### Production Catalog

- resources;
- machines;
- ports;
- recipes;
- objectives;
- upgrades later;
- capabilities later.

### Runtime Graph

- placed nodes;
- links;
- selected recipes;
- current machine state;
- buffers;
- diagnostics.

### Evaluator

- validates connections;
- resolves production;
- detects blocked outputs;
- checks objectives;
- emits diagnostics.

### UI / Renderer

- displays graph;
- handles drag/connect/edit;
- shows diagnostics;
- shows objective progress;
- plays feedback.

## Current Stack Bias

Use React and React Flow for the active prototype unless the director explicitly changes direction.

Do not prematurely move to Tauri, Electron, CEF, Godot, or another shell before Slice 1 playability is stable.

## Backend Direction

Keep the production model portable enough to support a future C++ backend if needed.

Avoid:

- browser-only assumptions in catalog data;
- React-specific production logic;
- renderer-owned validation;
- shell-specific persistence assumptions.

## Dependency Rule

No new major dependency may be added without a decision-log entry.
