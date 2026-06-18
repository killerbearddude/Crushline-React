# Production Domain Model

## Core Rule

Content should be data. Behavior should be systems.

Hardcode physics-like categories. Data-drive design categories.

## Stable or Semi-Stable Concepts

These may be enums or equivalent stable constants:

- resource state;
- port direction;
- basic port kind;
- diagnostic severity;
- flow mode if needed.

## Plastic Content

These should be data-driven IDs or tags:

- resources;
- machines;
- recipes;
- machine classes;
- process families;
- capabilities;
- route credits;
- objectives;
- scenario modifiers;
- machine tiers;
- upgrade definitions;
- certification thresholds.

## Resource Model

A resource may have multiple tags.

Example: `dirty_water` may be liquid, waste, byproduct, recoverable, water_family, and early_pressure.

Do not model resource role as one exclusive enum.

## Machine Model

A machine should define:

- ID;
- display name;
- class;
- ports;
- supported process families;
- capabilities;
- power behavior;
- recipe compatibility;
- diagnostics.

## Port Model

A port should define:

- direction;
- kind;
- accepted resource states;
- accepted resource IDs;
- accepted tags;
- required/optional status;
- max rate if needed.

## Recipe Model

A recipe should define:

- ID;
- display name;
- process family;
- input resources;
- output resources;
- byproducts;
- waste outputs;
- required machine class or capability;
- duration;
- power requirement;
- route credits if needed.

## Plasticity Principle

Content can churn. Systems should survive.

Resources, recipes, tags, objectives, and machine classes may change during development. The implementation should make these changes cheap.

## Validation Requirements

The catalog should eventually be validated for:

- missing IDs;
- impossible recipes;
- unused resources;
- orphaned machines;
- invalid port definitions;
- objectives that cannot be completed;
- diagnostics with no repair path.
