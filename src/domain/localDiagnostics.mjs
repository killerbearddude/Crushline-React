import { checkPortCompatibility } from "./portCompatibility.mjs";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function byId(items) {
  const index = new Map();
  if (!Array.isArray(items)) return index;
  for (const item of items) {
    if (isObject(item) && typeof item.id === "string") index.set(item.id, item);
  }
  return index;
}

function diagnosticsById(catalog) {
  return byId(catalog?.diagnostics?.diagnostics);
}

function machinesById(catalog) {
  return byId(catalog?.machines?.machines);
}

function graphMachines(graph) {
  return Array.isArray(graph?.machines) ? graph.machines : [];
}

function graphConnections(graph) {
  return Array.isArray(graph?.connections) ? graph.connections : [];
}

function graphMachineCatalogId(machine) {
  return machine.catalog_machine_id ?? machine.machine_catalog_id ?? machine.catalog_id;
}

function connectionSourceMachineId(connection) {
  return connection.source_runtime_machine_id ?? connection.source_machine_id;
}

function definition(catalog, definitionId) {
  return diagnosticsById(catalog).get(definitionId);
}

function diagnosticInstance(catalog, definitionId, target, context) {
  const diagnosticDefinition = definition(catalog, definitionId);
  if (!diagnosticDefinition) {
    throw new Error(`Missing diagnostic definition "${definitionId}".`);
  }

  return {
    definition_id: definitionId,
    severity: diagnosticDefinition.severity,
    target,
    context,
  };
}

export function diagnoseConnectionAttempt(catalog, connection) {
  const result = checkPortCompatibility(catalog, connection);
  if (result.compatible) return [];

  return [
    diagnosticInstance(
      catalog,
      "invalid_connection",
      {
        kind: "connection_attempt",
        source_machine_id: connection.source_machine_id,
        source_port_id: connection.source_port_id,
        target_machine_id: connection.target_machine_id,
        target_port_id: connection.target_port_id,
      },
      {
        resource_id: connection.resource_id,
        reasons: result.errors,
      },
    ),
  ];
}

export function diagnoseGraphConnections(catalog, graph) {
  const diagnostics = [];
  for (const connection of graphConnections(graph)) {
    diagnostics.push(...diagnoseConnectionAttempt(catalog, connection));
  }
  return diagnostics;
}

function isCompatibleDirtyWaterHandlingConnection(catalog, runtimeMachine, connection) {
  return (
    connectionSourceMachineId(connection) === runtimeMachine.id &&
    connection.source_port_id === "dirty_water_output" &&
    connection.resource_id === "dirty_water" &&
    checkPortCompatibility(catalog, connection).compatible
  );
}

export function diagnoseDirtyWaterBlockage(catalog, graph) {
  const diagnostics = [];
  const catalogMachines = machinesById(catalog);
  const connections = graphConnections(graph);

  for (const runtimeMachine of graphMachines(graph)) {
    const catalogMachineId = graphMachineCatalogId(runtimeMachine);
    const catalogMachine = catalogMachines.get(catalogMachineId);
    if (!catalogMachine || catalogMachine.machine_class !== "washer") continue;

    const hasDirtyWaterHandling = connections.some((connection) =>
      isCompatibleDirtyWaterHandlingConnection(catalog, runtimeMachine, connection),
    );

    if (hasDirtyWaterHandling) continue;

    diagnostics.push(
      diagnosticInstance(
        catalog,
        "dirty_water_output_blocked",
        {
          kind: "port",
          machine_id: runtimeMachine.id,
          port_id: "dirty_water_output",
        },
        {
          machine_catalog_id: catalogMachineId,
          resource_id: "dirty_water",
        },
      ),
    );
  }

  return diagnostics;
}

export function diagnoseLocalGraph(catalog, graph) {
  return [...diagnoseGraphConnections(catalog, graph), ...diagnoseDirtyWaterBlockage(catalog, graph)];
}
