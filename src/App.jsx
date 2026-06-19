import { useCallback, useMemo, useState } from "react";
import { Background, Controls, Handle, MiniMap, Position, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import diagnosticsCatalog from "../catalog/slice1_diagnostics.json";
import machinesCatalog from "../catalog/slice1_machines.json";
import objectivesCatalog from "../catalog/slice1_objectives.json";
import recipesCatalog from "../catalog/slice1_recipes.json";
import resourcesCatalog from "../catalog/slice1_resources.json";
import { diagnoseConnectionAttempt, diagnoseLocalGraph } from "./domain/localDiagnostics.mjs";
import { evaluateObjectives } from "./domain/objectiveProgress.mjs";
import { evaluateRuntimeGraph } from "./domain/runtimeGraphEvaluator.mjs";

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
    { id: "processor_1", catalog_machine_id: "basic_processor" },
  ],
  external_resources: ["coal", "iron_ore", "water"],
  connections: [
    {
      id: "invalid_power_to_solid",
      source_runtime_machine_id: "generator_1",
      source_machine_id: "basic_generator",
      source_port_id: "power_output",
      target_runtime_machine_id: "crusher_1",
      target_machine_id: "crusher",
      target_port_id: "solid_input",
      resource_id: "power",
    },
    {
      id: "generator_power_to_washer",
      source_runtime_machine_id: "generator_1",
      source_machine_id: "basic_generator",
      source_port_id: "power_output",
      target_runtime_machine_id: "washer_1",
      target_machine_id: "washer",
      target_port_id: "power_input",
      resource_id: "power",
    },
    {
      id: "generator_power_to_processor",
      source_runtime_machine_id: "generator_1",
      source_machine_id: "basic_generator",
      source_port_id: "power_output",
      target_runtime_machine_id: "processor_1",
      target_machine_id: "basic_processor",
      target_port_id: "power_input",
      resource_id: "power",
    },
    {
      id: "crusher_to_washer_solid",
      source_runtime_machine_id: "crusher_1",
      source_machine_id: "crusher",
      source_port_id: "solid_output",
      target_runtime_machine_id: "washer_1",
      target_machine_id: "washer",
      target_port_id: "solid_input",
      resource_id: "crushed_iron_ore",
    },
    {
      id: "washer_to_processor_solid",
      source_runtime_machine_id: "washer_1",
      source_machine_id: "washer",
      source_port_id: "solid_output",
      target_runtime_machine_id: "processor_1",
      target_machine_id: "basic_processor",
      target_port_id: "solid_input",
      resource_id: "washed_iron_ore",
    },
  ],
};

const repairedPowerConnection = {
  id: "generator_power_to_crusher",
  source_runtime_machine_id: "generator_1",
  source_machine_id: "basic_generator",
  source_port_id: "power_output",
  target_runtime_machine_id: "crusher_1",
  target_machine_id: "crusher",
  target_port_id: "power_input",
  resource_id: "power",
};

const dirtyWaterHandlingConnection = {
  id: "washer_dirty_water_to_sink",
  source_runtime_machine_id: "washer_1",
  source_machine_id: "washer",
  source_port_id: "dirty_water_output",
  target_runtime_machine_id: "waste_sink_1",
  target_machine_id: "waste_sink",
  target_port_id: "waste_input",
  resource_id: "dirty_water",
};

const initialNodePositions = {
  generator_1: { x: 0, y: 60 },
  crusher_1: { x: 260, y: 60 },
  washer_1: { x: 520, y: 60 },
  waste_sink_1: { x: 520, y: 260 },
  processor_1: { x: 780, y: 60 },
};

const displayNames = new Map(catalog.machines.machines.map((machine) => [machine.id, machine.display_name]));
const catalogMachinesById = new Map(catalog.machines.machines.map((machine) => [machine.id, machine]));
const diagnosticDefinitions = new Map(catalog.diagnostics.diagnostics.map((diagnostic) => [diagnostic.id, diagnostic]));

function readablePortName(portId) {
  return portId.replaceAll("_", " ");
}

function portHandleTop(index) {
  return 44 + index * 24;
}

function MachineNode({ data }) {
  const ports = data.catalogMachine?.ports ?? [];

  return (
    <div className="machine-node">
      <strong>{data.displayName}</strong>
      <span>{data.runtimeMachine.id}</span>
      {data.diagnosticCount > 0 ? <em>{data.diagnosticCount} diagnostic</em> : null}
      <div className="port-list" aria-label={`${data.displayName} ports`}>
        {ports.map((port, index) => {
          const isInput = port.direction === "input";
          return (
            <div key={port.id} className={`port-row ${port.direction}`}>
              <Handle
                id={port.id}
                type={isInput ? "target" : "source"}
                position={isInput ? Position.Left : Position.Right}
                className={`port-handle ${port.kind}`}
                style={{ top: portHandleTop(index) }}
              />
              <small>{port.display_name ?? readablePortName(port.id)}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const nodeTypes = {
  machine: MachineNode,
};

function diagnosticLabel(diagnostic) {
  const definition = diagnosticDefinitions.get(diagnostic.definition_id);
  const fallback = definition ?? {
    title: diagnostic.definition_id,
    message: "No diagnostic definition found.",
    repair_hint: "Check diagnostics catalog.",
  };

  if (diagnostic.definition_id === "invalid_connection") {
    const sourcePort = readablePortName(diagnostic.target.source_port_id ?? "source port");
    const targetPort = readablePortName(diagnostic.target.target_port_id ?? "target port");
    return {
      ...fallback,
      message: `${sourcePort} cannot connect to ${targetPort}.`,
      repair_hint: "Connect an output port to a compatible input port.",
      target_label: "Rejected connection attempt",
    };
  }

  if (diagnostic.target.kind === "port") {
    return {
      ...fallback,
      target_label: `${diagnostic.target.machine_id} / ${diagnostic.target.port_id}`,
    };
  }

  return {
    ...fallback,
    target_label: diagnostic.target.kind,
  };
}

function diagnosticsForMachine(diagnostics, runtimeMachineId) {
  return diagnostics.filter((diagnostic) => diagnostic.target.machine_id === runtimeMachineId);
}

function hasDiagnostic(diagnostics, definitionId) {
  return diagnostics.some((diagnostic) => diagnostic.definition_id === definitionId);
}

function graphNodes(graph, diagnostics, nodePositions) {
  return graph.machines.map((machine) => {
    const catalogMachine = catalogMachinesById.get(machine.catalog_machine_id);
    const localDiagnostics = diagnosticsForMachine(diagnostics, machine.id);
    return {
      id: machine.id,
      type: "machine",
      position: nodePositions[machine.id] ?? { x: 0, y: 0 },
      data: {
        runtimeMachine: machine,
        catalogMachine,
        displayName: displayNames.get(machine.catalog_machine_id) ?? machine.catalog_machine_id,
        diagnosticCount: localDiagnostics.length,
      },
    };
  });
}

function graphEdges(graph) {
  return graph.connections.map((connection) => ({
    id: connection.id,
    source: connection.source_runtime_machine_id,
    sourceHandle: connection.source_port_id,
    target: connection.target_runtime_machine_id,
    targetHandle: connection.target_port_id,
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

function graphMachinesByRuntimeId(graph) {
  return new Map(graph.machines.map((machine) => [machine.id, machine]));
}

function findPort(catalogMachine, portId) {
  return catalogMachine?.ports?.find((port) => port.id === portId);
}

function firstAcceptedResource(port) {
  return Array.isArray(port?.accepted_resources) ? port.accepted_resources[0] : undefined;
}

function inferAttemptResource(sourcePort, targetPort) {
  return firstAcceptedResource(sourcePort) ?? firstAcceptedResource(targetPort) ?? "unknown_resource";
}

function buildConnectionAttempt(graph, connectionParams) {
  const runtimeMachines = graphMachinesByRuntimeId(graph);
  const sourceRuntimeMachine = runtimeMachines.get(connectionParams.source);
  const targetRuntimeMachine = runtimeMachines.get(connectionParams.target);
  if (!sourceRuntimeMachine || !targetRuntimeMachine) return undefined;

  const sourceMachineId = sourceRuntimeMachine.catalog_machine_id;
  const targetMachineId = targetRuntimeMachine.catalog_machine_id;
  const sourceCatalogMachine = catalogMachinesById.get(sourceMachineId);
  const targetCatalogMachine = catalogMachinesById.get(targetMachineId);
  const sourcePort = findPort(sourceCatalogMachine, connectionParams.sourceHandle);
  const targetPort = findPort(targetCatalogMachine, connectionParams.targetHandle);
  const resourceId = inferAttemptResource(sourcePort, targetPort);

  return {
    id: `player_${connectionParams.source}_${connectionParams.sourceHandle}_to_${connectionParams.target}_${connectionParams.targetHandle}`,
    source_runtime_machine_id: connectionParams.source,
    source_machine_id: sourceMachineId,
    source_port_id: connectionParams.sourceHandle,
    target_runtime_machine_id: connectionParams.target,
    target_machine_id: targetMachineId,
    target_port_id: connectionParams.targetHandle,
    resource_id: resourceId,
  };
}

export default function App() {
  const [graph, setGraph] = useState(initialPrototypeGraph);
  const [nodePositions, setNodePositions] = useState(initialNodePositions);
  const [connectionAttemptDiagnostics, setConnectionAttemptDiagnostics] = useState([]);
  const graphDiagnostics = useMemo(() => diagnoseLocalGraph(catalog, graph), [graph]);
  const diagnostics = useMemo(
    () => [...connectionAttemptDiagnostics, ...graphDiagnostics],
    [connectionAttemptDiagnostics, graphDiagnostics],
  );
  const evaluatorResult = useMemo(() => evaluateRuntimeGraph(catalog, graph), [graph]);
  const objectives = useMemo(() => evaluateObjectives(catalog, evaluatorResult.progress), [evaluatorResult]);
  const basicIronObjective = objectives.find((objective) => objective.objective_id === "basic_iron_certification");
  const nodes = useMemo(() => graphNodes(graph, diagnostics, nodePositions), [graph, diagnostics, nodePositions]);
  const edges = useMemo(() => graphEdges(graph), [graph]);

  const handleNodesChange = useCallback((changes) => {
    setNodePositions((currentPositions) => {
      let nextPositions = currentPositions;

      for (const change of changes) {
        if (change.type !== "position" || !change.position) continue;
        if (nextPositions === currentPositions) nextPositions = { ...currentPositions };
        nextPositions[change.id] = change.position;
      }

      return nextPositions;
    });
  }, []);

  const handleConnect = useCallback(
    (connectionParams) => {
      const connectionAttempt = buildConnectionAttempt(graph, connectionParams);
      if (!connectionAttempt) return;

      const attemptDiagnostics = diagnoseConnectionAttempt(catalog, connectionAttempt);
      if (attemptDiagnostics.length > 0) {
        setConnectionAttemptDiagnostics(attemptDiagnostics);
        return;
      }

      setConnectionAttemptDiagnostics([]);
      setGraph((currentGraph) => ({
        ...currentGraph,
        connections: addConnectionOnce(currentGraph.connections, connectionAttempt),
      }));
    },
    [graph],
  );

  const repairInvalidConnection = () => {
    setConnectionAttemptDiagnostics([]);
    setGraph((currentGraph) => ({
      ...currentGraph,
      connections: replaceConnection(currentGraph.connections, "invalid_power_to_solid", repairedPowerConnection),
    }));
  };

  const connectDirtyWaterHandling = () => {
    setConnectionAttemptDiagnostics([]);
    setGraph((currentGraph) => ({
      ...currentGraph,
      connections: addConnectionOnce(currentGraph.connections, dirtyWaterHandlingConnection),
    }));
  };

  const resetGraph = () => {
    setGraph(initialPrototypeGraph);
    setNodePositions(initialNodePositions);
    setConnectionAttemptDiagnostics([]);
  };

  const hasInvalidConnectionDiagnostic = hasDiagnostic(graphDiagnostics, "invalid_connection");
  const hasDirtyWaterDiagnostic = hasDiagnostic(graphDiagnostics, "dirty_water_output_blocked");

  return (
    <main className="app-shell">
      <section className="graph-panel" aria-label="Slice 1 prototype graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={handleConnect}
          onNodesChange={handleNodesChange}
          fitView
          nodesDraggable
        >
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
            Reset prototype
          </button>
        </div>

        <p className="interaction-hint">Drag from an output port handle to an input port handle to test a connection.</p>

        {diagnostics.length === 0 ? (
          <p className="all-clear">No active diagnostics. Runtime evaluator can derive route progress.</p>
        ) : (
          <ul>
            {diagnostics.map((diagnostic, index) => {
              const definition = diagnosticLabel(diagnostic);
              return (
                <li key={`${diagnostic.definition_id}-${index}`} className={`diagnostic ${diagnostic.severity}`}>
                  <span>{diagnostic.severity}</span>
                  <h2>{definition.title}</h2>
                  <p className="diagnostic-summary">{definition.message}</p>
                  <p className="diagnostic-repair">Fix: {definition.repair_hint}</p>
                  <small>{definition.target_label}</small>
                </li>
              );
            })}
          </ul>
        )}

        {basicIronObjective ? (
          <section className={`objective-panel ${basicIronObjective.complete ? "complete" : "incomplete"}`}>
            <h2>{basicIronObjective.display_name}</h2>
            <p>{basicIronObjective.description}</p>
            <ul>
              {basicIronObjective.requirements.map((requirement) => (
                <li key={`${requirement.kind}-${requirement.resource_id ?? requirement.recipe_id}`}>
                  <strong>{requirement.complete ? "Complete" : "Incomplete"}</strong>
                  <span>{requirement.label}</span>
                  <small>
                    {requirement.current} / {requirement.required}
                  </small>
                </li>
              ))}
            </ul>
            {basicIronObjective.complete ? <p className="certified">Basic Iron Certification complete.</p> : null}
          </section>
        ) : null}
      </aside>
    </main>
  );
}
