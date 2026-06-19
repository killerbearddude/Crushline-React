import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { diagnoseConnectionAttempt, diagnoseDirtyWaterBlockage, diagnoseLocalGraph } from "../src/domain/localDiagnostics.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function loadCatalog() {
  return {
    resources: readJson("catalog/slice1_resources.json"),
    machines: readJson("catalog/slice1_machines.json"),
    recipes: readJson("catalog/slice1_recipes.json"),
    objectives: readJson("catalog/slice1_objectives.json"),
    diagnostics: readJson("catalog/slice1_diagnostics.json"),
  };
}

function connection(sourceMachine, sourcePort, targetMachine, targetPort, resource) {
  return {
    source_machine_id: sourceMachine,
    source_port_id: sourcePort,
    target_machine_id: targetMachine,
    target_port_id: targetPort,
    resource_id: resource,
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function expectDiagnostic(name, diagnostics, definitionId) {
  assert(
    diagnostics.some((diagnostic) => diagnostic.definition_id === definitionId),
    `${name}: expected diagnostic "${definitionId}".`,
  );
}

function expectNoDiagnostic(name, diagnostics, definitionId) {
  assert(
    !diagnostics.some((diagnostic) => diagnostic.definition_id === definitionId),
    `${name}: did not expect diagnostic "${definitionId}".`,
  );
}

const catalog = loadCatalog();

const invalidConnectionDiagnostics = diagnoseConnectionAttempt(
  catalog,
  connection("basic_generator", "power_output", "crusher", "solid_input", "power"),
);
expectDiagnostic("invalid connection attempt", invalidConnectionDiagnostics, "invalid_connection");
assert(
  invalidConnectionDiagnostics[0].target.kind === "connection_attempt",
  "invalid connection diagnostic should target the connection attempt.",
);
assert(
  Array.isArray(invalidConnectionDiagnostics[0].context.reasons) && invalidConnectionDiagnostics[0].context.reasons.length > 0,
  "invalid connection diagnostic should include readable reasons.",
);

const validConnectionDiagnostics = diagnoseConnectionAttempt(
  catalog,
  connection("basic_generator", "power_output", "crusher", "power_input", "power"),
);
expectNoDiagnostic("valid connection attempt", validConnectionDiagnostics, "invalid_connection");

const graphWithBlockedDirtyWater = {
  machines: [{ id: "washer_1", catalog_machine_id: "washer" }],
  connections: [],
};
const dirtyWaterDiagnostics = diagnoseDirtyWaterBlockage(catalog, graphWithBlockedDirtyWater);
expectDiagnostic("blocked dirty water", dirtyWaterDiagnostics, "dirty_water_output_blocked");
assert(dirtyWaterDiagnostics[0].target.kind === "port", "dirty water diagnostic should target a port.");
assert(
  dirtyWaterDiagnostics[0].target.machine_id === "washer_1" && dirtyWaterDiagnostics[0].target.port_id === "dirty_water_output",
  "dirty water diagnostic should target the washer dirty water output.",
);

const graphWithHandledDirtyWater = {
  machines: [
    { id: "washer_1", catalog_machine_id: "washer" },
    { id: "waste_sink_1", catalog_machine_id: "waste_sink" },
  ],
  connections: [
    {
      source_runtime_machine_id: "washer_1",
      source_machine_id: "washer",
      source_port_id: "dirty_water_output",
      target_machine_id: "waste_sink",
      target_port_id: "waste_input",
      resource_id: "dirty_water",
    },
  ],
};
expectNoDiagnostic(
  "handled dirty water",
  diagnoseDirtyWaterBlockage(catalog, graphWithHandledDirtyWater),
  "dirty_water_output_blocked",
);

const combinedDiagnostics = diagnoseLocalGraph(catalog, {
  machines: [{ id: "washer_1", catalog_machine_id: "washer" }],
  connections: [connection("basic_generator", "power_output", "crusher", "solid_input", "power")],
});
expectDiagnostic("combined diagnostics invalid connection", combinedDiagnostics, "invalid_connection");
expectDiagnostic("combined diagnostics dirty water", combinedDiagnostics, "dirty_water_output_blocked");

console.log("Slice 1 local diagnostics checks passed.");
