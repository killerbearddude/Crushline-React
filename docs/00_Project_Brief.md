# Crushline Project Brief

## One-Sentence Description

Crushline is a production-graph game where players build, repair, upgrade, and certify industrial systems by connecting machines, typed ports, resources, waste streams, power, and recovery loops.

## Core Fantasy

The player is not merely crafting items. The player is authoring an industrial organism: a graph that transforms resources, manages waste, survives constraints, and eventually proves closed-line stability.

## Design Inspiration

Crushline is inspired by expert-pack production progression, but it should not copy expert-pack patchwork.

Borrow:

- staged capability progression;
- deep material chains;
- machine upgrades;
- route equivalence;
- waste and byproduct pressure;
- power stability;
- milestone guidance;
- late-game system integration.

Avoid:

- recipe bloat before the core loop is fun;
- patchwork scripting;
- arbitrary ingredient difficulty;
- hardcoded recipe trees;
- renderer-dependent production logic.

## Current Development Priority

Build Slice 1.

Slice 1 should prove that a small production graph can be placed, connected, diagnosed, repaired, and completed in a satisfying way.

## Current Active Prototype Direction

React Flow is the active prototype path unless explicitly changed by the director.

React Flow is the UI/interaction layer, not the production-domain model.

## Long-Term Direction

The long-term endgame is Closed-Line Certification: the player assembles a Closed-Line Seed and proves that the graph can remain stable under constrained external-input conditions.

## Director Rule

Agents may implement bounded tasks, but the director owns scope, architecture, acceptance criteria, and final decisions.
