import { useMemo, useState } from "react";
import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import diagnosticsCatalog from "../catalog/slice1_diagnostics.json";
import machinesCatalog from "../catalog/slice1_machines.json";
import objectivesCatalog from "../catalog/slice1_objectives.json";
import recipesCatalog from "../catalog/slice1_recipes.json";
import resourcesCatalog from "../catalog/slice1_resources.json";
import { diagnoseLocalGraph } from "./domain/localDiagnostics.mjs";

const catalog = {
  resources: resourcesCatalog,
  machines: machinesCatalog,
  recipes: recipesCatalog,
  objectives: objectivesCatalog,
  diagnostics: diagnosticsCatalog,
};

const initialPrototypeGraph = {
  machines: [
    { id: "generator_1", catalog_machine_id: "basic_generator" },
    { id: "crusher_1", catalog_machine_id: "crusher" },
    { id: "washer_1", catalog_machine_id: "washer" },
    { id: "waste_sink_1", catalog_machine_id: "waste_sink" },
  ],
  connections: [
    {
      id: "invalid_power_to_solid",
      source_runtime_machine_id: "generator_1",
      source_machine_id: "basic_generator",
      source_port_id: "power_output",
      target_machine_id: "crusher",
      target_port_id: "solid_input",
      resource_id: "power",
    },
  ],
};

const repairedPowerConnection = {
  id: "generator_power_to_crusher",
  source_runtime_machine_id: "generator_1",
  source_machine_id: "basic_generator",
  source_port_id: "power_output",
  target_machine_id: "crusher",
  target_port_id: "power_input",
  resource_id: "power",
};

const dirtyWaterHandlingConnection = {
  id: "washer_dirty_water_to_sink",
  source_runtime_machine_id: "washer_1",
  source_machine_id: "washer",
  source_port_id: "dirty_water_output",
  target_machine_id: "waste_sink",
  target_port_id: "waste_input",
  resource_id: "dirty_water",
};

const nodePositions = {
  generator_1: { x: 0, y: 60 },
  crusher_1: { x: 260, y: 60 },
  washer_1: { x: 520, y: 60 },
  waste_sink_1: { x: 520, y: 260 },
};

const displayNames = new Map(catalog.machines.machines.map((machine) => [machine.id, machine.display_name]));
const diagnosticDefinitions = new Map(catalog.diagnostics.diagnostics.map((diagnostic) => [diagnostic.id, diagnostic]));

function diagnosticLabel(diagnostic) {
  const definition = diagnosticDefinitions.get(diagnostic.definition_id);
  return definition ?? {
    title: diagnostic.definition_id,
    message: "No diagnostic definition found.",
    repair_hint: "Check diagnostics catalog.",
  };
}

function diagnosticsForMachine(diagnostics, runtimeMachineId) {
  return diagnostics.filter((diagnostic) => diagnostic.target.machine_id === runtimeMachineId);
}

function hasDiagnostic(diagnostics, definitionId) {
  return diagnostics.some((diagnostic) => diagnostic.definition_id === definitionId);
}

function graphNodes(graph, diagnostics) {
  return graph.machines.map((machine) => {
    const localDiagnostics = diagnosticsForMachine(diagnostics, machine.id);
    return {
      id: machine.id,
      type: "default",
      position: nodePositions[machine.id],
      data: {
        label: (
          <div className="machine-node">
            <strong>{displayNames.get(machine.catalog_machine_id) ?? machine.catalog_machine_id}</strong>
            <span>{machine.id}</span>
            {localDiagnostics.length > 0 ? <em>{localDiagnostics.length} diagnostic</em> : null}
          </div>
        ),
      },
    };
  });
}

function graphEdges(graph) {
  return graph.connections.map((connection) => ({
    id: connection.id,
    source: connection.source_runtime_machine_id,
    target: connection.target_machine_id === "crusher" ? "crusher_1" : "waste_sink_1",
    label: `${connection.source_port_id} → ${connection.target_port_id}`,
    animated: connection.id === "invalid_power_to_solid",
  }));
}

function replaceConnection(connections, oldConnectionId, replacement) {
  return [...connections.filter((connection) => connection.id !== oldConnectionId), replacement];
}

function addConnectionOnce(connections, connectionToAdd) {
  if (connections.some((connection) => connection.id === connectionToAdd.id)) return connections;
  return [...connections, connectionToAdd];
}

export default function App() {
  const [graph, setGraph] = useState(initialPrototypeGraph);
  const diagnostics = useMemo(() => diagnoseLocalGraph(catalog, graph), [graph]);
  const nodes = useMemo(() => graphNodes(graph, diagnostics), [graph, diagnostics]);
  const edges = useMemo(() => graphEdges(graph), [graph]);

  const repairInvalidConnection = () => {
    setGraph((currentGraph) => ({
      ...currentGraph,
      connections: replaceConnection(currentGraph.connections, "invalid_power_to_solid", repairedPowerConnection),
    }));
  };

  const connectDirtyWaterHandling = () => {
    setGraph((currentGraph) => ({
      ...currentGraph,
      connections: addConnectionOnce(currentGraph.connections, dirtyWaterHandlingConnection),
    }));
  };

  const resetGraph = () => setGraph(initialPrototypeGraph);
  const hasInvalidConnectionDiagnostic = hasDiagnostic(diagnostics, "invalid_connection");
  const hasDirtyWaterDiagnostic = hasDiagnostic(diagnostics, "dirty_water_output_blocked");

  return (
    <main className="app-shell">
      <section className="graph-panel" aria-label="Slice 1 prototype graph">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </section>

      <aside className="diagnostics-panel" aria-label="Active diagnostics">
        <header>
          <p>Slice 1 Prototype</p>
          <h1>Local Diagnostics</h1>
        </header>

        <div className="repair-actions" aria-label="Graph repair actions">
          <button type="button" onClick={repairInvalidConnection} disabled={!hasInvalidConnectionDiagnostic}>
            Repair invalid power connection
          </button>
          <button type="button" onClick={connectDirtyWaterHandling} disabled={!hasDirtyWaterDiagnostic}>
            Connect Dirty Water to Waste Sink
          </button>
          <button type="button" onClick={resetGraph}>
            Reset prototype graph
          </button>
        </div>

        {diagnostics.length === 0 ? (
          <p className="all-clear">No active diagnostics. Graph repair checks passed.</p>
        ) : (
          <ul>
            {diagnostics.map((diagnostic, index) => {
              const definition = diagnosticLabel(diagnostic);
              return (
                <li key={`${diagnostic.definition_id}-${index}`} className={`diagnostic ${diagnostic.severity}`}>
                  <span>{diagnostic.severity}</span>
                  <h2>{definition.title}</h2>
                  <p>{definition.message}</p>
                  <strong>Repair:</strong>
                  <p>{definition.repair_hint}</p>
                  <small>{diagnostic.target.kind}</small>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </main>
  );
}
