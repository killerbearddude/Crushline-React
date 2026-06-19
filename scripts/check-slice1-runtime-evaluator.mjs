import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateObjectives } from "../src/domain/objectiveProgress.mjs";
import { evaluateRuntimeGraph } from "../src/domain/runtimeGraphEvaluator.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const catalog = {
  resources: readJson("catalog/slice1_resources.json"),
  machines: readJson("catalog/slice1_machines.json"),
  recipes: readJson("catalog/slice1_recipes.json"),
  objectives: readJson("catalog/slice1_objectives.json"),
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const machines = [
  ["generator_1", "basic_generator"],
  ["crusher_1", "crusher"],
  ["washer_1", "washer"],
  ["waste_sink_1", "waste_sink"],
  ["processor_1", "basic_processor"],
].map(([id, catalog_machine_id]) => ({ id, catalog_machine_id }));

function connection(id, sourceRuntime, sourceMachine, sourcePort, targetRuntime, targetMachine, targetPort, resource) {
  return {
    id,
    source_runtime_machine_id: sourceRuntime,
    source_machine_id: sourceMachine,
    source_port_id: sourcePort,
    target_runtime_machine_id: targetRuntime,
    target_machine_id: targetMachine,
    target_port_id: targetPort,
    resource_id: resource,
  };
}

const fullConnections = [
  connection("generator_to_crusher_power", "generator_1", "basic_generator", "power_output", "crusher_1", "crusher", "power_input", "power"),
  connection("generator_to_washer_power", "generator_1", "basic_generator", "power_output", "washer_1", "washer", "power_input", "power"),
  connection("generator_to_processor_power", "generator_1", "basic_generator", "power_output", "processor_1", "basic_processor", "power_input", "power"),
  connection("crusher_to_washer_solid", "crusher_1", "crusher", "solid_output", "washer_1", "washer", "solid_input", "crushed_iron_ore"),
  connection("washer_to_sink_dirty_water", "washer_1", "washer", "dirty_water_output", "waste_sink_1", "waste_sink", "waste_input", "dirty_water"),
  connection("washer_to_processor_solid", "washer_1", "washer", "solid_output", "processor_1", "basic_processor", "solid_input", "washed_iron_ore"),
];

const graph = (connections) => ({ machines, external_resources: ["coal", "iron_ore", "water"], connections });
const evaluate = (connections) => evaluateRuntimeGraph(catalog, graph(connections));

const full = evaluate(fullConnections);
assert(full.progress.completed_recipes.sink_dirty_water === 1, "Full route should complete sink_dirty_water.");
assert(full.progress.produced_resources.basic_iron_output === 1, "Full route should produce basic_iron_output.");
assert(
  evaluateObjectives(catalog, full.progress).find((objective) => objective.objective_id === "basic_iron_certification")?.complete,
  "Full route progress should complete Basic Iron Certification.",
);

const withoutDirtyWater = evaluate(fullConnections.filter((item) => item.id !== "washer_to_sink_dirty_water"));
assert(!withoutDirtyWater.progress.completed_recipes.sink_dirty_water, "Missing Dirty Water handling should not complete sink recipe.");
assert(!withoutDirtyWater.progress.produced_resources.basic_iron_output, "Blocked Dirty Water should prevent Basic Iron Output.");

const staleDirtyWaterTarget = evaluate(
  fullConnections.map((item) =>
    item.id === "washer_to_sink_dirty_water" ? { ...item, target_runtime_machine_id: "missing_sink_1" } : item,
  ),
);
assert(!staleDirtyWaterTarget.progress.completed_recipes.sink_dirty_water, "Stale Dirty Water target should not complete sink recipe.");
assert(!staleDirtyWaterTarget.progress.produced_resources.basic_iron_output, "Stale Dirty Water target should block Basic Iron Output.");

const withoutProcessorInput = evaluate(fullConnections.filter((item) => item.id !== "washer_to_processor_solid"));
assert(!withoutProcessorInput.progress.produced_resources.basic_iron_output, "Missing processor route should not produce basic_iron_output.");

const wrongSource = evaluate(
  fullConnections.map((item) =>
    item.id === "washer_to_processor_solid" ? { ...item, source_runtime_machine_id: "crusher_1", source_machine_id: "crusher" } : item,
  ),
);
assert(!wrongSource.progress.produced_resources.basic_iron_output, "Washed ore must come from the washer runtime machine.");

console.log("Slice 1 runtime graph evaluator checks passed.");
