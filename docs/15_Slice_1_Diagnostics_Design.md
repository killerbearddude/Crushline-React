# Slice 1 Diagnostics Design

## Purpose

Define the smallest diagnostics model needed for Slice 1.

Slice 1 diagnostics must help the player understand local graph problems, repair them, and see the problem disappear when fixed. This design is intentionally limited to invalid connection feedback, blocked dirty water output, missing required inputs, and objective progress clarity.

## Design Constraints

- Diagnostics are part of the production domain and runtime graph, not React Flow-specific UI state.
- The evaluator owns diagnostic detection.
- The UI owns diagnostic presentation.
- Catalog or data-like files may own player-facing copy and repair hints.
- Conditions should be stable IDs understood by systems, not arbitrary script strings.
- This design does not implement production simulation or React Flow UI.

## Ownership by Layer

### Production Catalog

Catalog data may define diagnostic copy templates and repair hints.

Catalog data should not define executable condition logic.

Allowed catalog-owned fields:

- `id`;
- `severity`;
- `title`;
- `message`;
- `repair_hint`;
- optional `applies_to` metadata such as `machine_class`, `port_id`, `resource_id`, or `recipe_id`.

### Runtime Graph

Runtime graph state owns active diagnostic instances.

A diagnostic instance should identify the local graph object that has the problem:

- machine/node ID;
- port ID when relevant;
- connection/link ID when relevant;
- objective ID when relevant.

### Evaluator

The evaluator owns detection and clearing of diagnostics.

The evaluator should:

- validate attempted connections;
- detect blocked required outputs;
- detect missing required inputs when a machine cannot run;
- check objective progress;
- emit active diagnostic instances;
- stop emitting a diagnostic when the underlying condition is fixed.

### UI / Renderer

The UI owns presentation only.

The UI may:

- show a diagnostic near the affected machine, port, connection, or objective;
- display severity, message, and repair hint;
- highlight the affected graph element.

The UI must not own production meaning or diagnostic condition logic.

## Minimal Diagnostic Shape

Diagnostic definitions should be data-like:

```json
{
  "id": "dirty_water_output_blocked",
  "severity": "blocking",
  "title": "Dirty Water output blocked",
  "message": "The Washer cannot continue because Dirty Water has nowhere to go.",
  "repair_hint": "Connect the Washer Dirty Water Output to a Waste Sink."
}
```

Runtime diagnostic instances should be emitted by systems:

```json
{
  "definition_id": "dirty_water_output_blocked",
  "severity": "blocking",
  "target": {
    "kind": "port",
    "machine_id": "washer_1",
    "port_id": "dirty_water_output"
  },
  "context": {
    "machine_catalog_id": "washer",
    "resource_id": "dirty_water"
  }
}
```

## Severity Values

Slice 1 should use only these severities:

- `blocking` — production or objective progress cannot continue;
- `warning` — the graph is valid but the player should notice a problem soon;
- `info` — objective or guidance information.

Do not add a large severity taxonomy during Slice 1.

## Required Slice 1 Diagnostic Cases

### Invalid Connection

Use when a player attempts an incompatible connection.

Owner:

- evaluator / connection validator detects;
- UI presents immediately near the attempted connection.

Minimum data:

- source machine ID;
- source port ID;
- target machine ID;
- target port ID;
- resource ID if known;
- reason from port compatibility.

Example definition ID:

```text
invalid_connection
```

Repair hint:

```text
Connect an output port to a compatible input port.
```

### Missing Required Input

Use when a machine cannot run because a required input is not connected or not receiving a needed resource.

Owner:

- evaluator detects from machine ports and selected recipe needs.

Example definition IDs:

```text
missing_required_input
missing_power_input
```

Repair hint examples:

```text
Connect the required input port.
Connect Power from a Basic Generator.
```

### Blocked Required Output

Use when a required output cannot emit its resource, especially dirty water.

Owner:

- evaluator detects blocked output state;
- dirty water blockage must be local to the washer dirty water output port.

Example definition ID:

```text
dirty_water_output_blocked
```

Repair hint:

```text
Connect Dirty Water Output to a Waste Sink.
```

### Objective Not Ready

Use only for simple objective progress feedback.

Owner:

- evaluator checks objectives;
- UI displays objective progress.

Example definition ID:

```text
objective_requirement_incomplete
```

Repair hint:

```text
Complete the listed requirement.
```

## Initial Catalog Copy Recommendation

If diagnostics copy is added to data, use a small new catalog file rather than embedding executable conditions in machines:

```text
catalog/slice1_diagnostics.json
```

The file should contain definitions only:

```json
{
  "version": 1,
  "diagnostics": [
    {
      "id": "invalid_connection",
      "severity": "blocking",
      "title": "Invalid connection",
      "message": "These ports are not compatible.",
      "repair_hint": "Connect an output port to a compatible input port."
    },
    {
      "id": "dirty_water_output_blocked",
      "severity": "blocking",
      "title": "Dirty Water output blocked",
      "message": "The Washer cannot continue because Dirty Water has nowhere to go.",
      "repair_hint": "Connect Dirty Water Output to a Waste Sink."
    }
  ]
}
```

The evaluator may reference these IDs when emitting runtime diagnostic instances.

## Explicit Non-Goals

Do not add during Slice 1 diagnostics work:

- full diagnostics framework;
- localization system;
- scripting language for diagnostic conditions;
- React Flow-specific diagnostic state;
- long-term Closed-Line diagnostic categories;
- route medals;
- advanced chemistry or gas diagnostics;
- automation diagnostics.

## Recommended Next Implementation Task

Task 0006 should add the minimal diagnostics catalog and validator support.

Task 0006 should not implement React Flow UI or full production simulation. It should only:

- add `catalog/slice1_diagnostics.json` with minimal definitions;
- update catalog loading and validation to include diagnostics definitions;
- validate diagnostic IDs, severities, messages, and repair hints;
- validate no duplicate diagnostic IDs;
- add a validation script case that proves malformed diagnostics are caught.

A later task should connect port compatibility failures and dirty water blockage detection to active runtime diagnostics.
