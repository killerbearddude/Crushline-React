# Slice 1 Target

## Purpose

Slice 1 proves the minimum playable Crushline loop.

The goal is not to build the full production game. The goal is to prove that a small graph can be placed, connected, diagnosed, repaired, and completed in a satisfying way.

## Slice 1 Player Flow

1. Place a generator.
2. Place a crusher.
3. Feed iron ore into the crusher.
4. Produce crushed iron ore.
5. Place a washer.
6. Feed crushed iron ore and water into the washer.
7. Produce washed iron ore.
8. Produce dirty water as a waste/byproduct stream.
9. Dirty water must be handled.
10. Place a filter or waste sink.
11. Resume production.
12. Produce basic iron output.
13. Complete Basic Iron Certification.

## Slice 1 Resources

Required:

- iron_ore;
- crushed_iron_ore;
- washed_iron_ore;
- basic_iron_output;
- water;
- dirty_water;
- coal;
- power.

Optional only if needed:

- filtered_water;
- slag;
- ash.

## Slice 1 Machines

Required:

- basic_generator;
- crusher;
- washer;
- filter or waste_sink;
- basic_processor or smelter.

Optional only if needed:

- buffer;
- splitter;
- merger.

## Slice 1 Must Prove

- machine placement;
- typed ports;
- compatible connections;
- invalid connection rejection;
- basic production flow;
- waste/byproduct pressure;
- local diagnostics;
- graph repair;
- objective completion;
- responsive interaction.

## Slice 1 Non-Goals

Do not add:

- gases;
- advanced chemistry;
- final Closed-Line Seed;
- full material catalog;
- large quest tree;
- automation;
- complex power grid;
- scenario modifiers;
- multiple victory routes;
- desktop packaging work;
- large renderer rewrite.

## Acceptance Criteria

Slice 1 is acceptable when:

- a new player can complete the basic iron route;
- invalid connections are explained locally;
- dirty water blockage is understandable;
- fixing dirty water resumes production;
- the objective completes reliably;
- production logic is not hardcoded into React Flow components;
- content is defined through data or data-like structures;
- the interaction feels responsive enough to continue development.
