import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateObjectives } from "../src/domain/objectiveProgress.mjs";
import { evaluateRuntimeGraph } from "../src/domain/runtimeGraphEvaluator.mjs";

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
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const machines = [
  { id: "generator_1", catalog_machine_id: "basic_generator" },
  { id: "crusher_1", catalog_machine_id: "crusher" },
  { id: "washer_1", catalog_machine_id: "washer" },
  { id: "waste_sink_1", catalog_machine_id: "waste_sink" },
  { id: "processor_1", catalog_machine_id: "basic_processor" },
];

const fullConnections = [
  {
    id: "generator_to_crusher_power",
    source_runtime_machine_id: "generator_1",
    source_machine_id: "basic_generator",
    source_port_id: "power_output",
    target_runtime_machine_id: "crusher_1",
    target_machine_id: "crusher",
    target_port_id: "power_input",
    resource_id: "power",
  },
  {
    id: "generator_to_washer_power",
    source_runtime_machine_id: "generator_1",
    source_machine_id: "basic_generator",
    source_port_id: "power_output",
    target_runtime_machine_id: "washer_1",
    target_machine_id: "washer",
    target_port_id: "power_input",
    resource_id: "power",
  },
  {
    id: "generator_to_processor_power",
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
    id: "washer_to_sink_dirty_water",
    source_runtime_machine_id: "washer_1",
    source_machine_id: "washer",
    source_port_id: "dirty_water_output",
    target_runtime_machine_id: "waste_sink_1",
    target_machine_id: "waste_sink",
    target_port_id: "waste_input",
    resource_id: "dirty_water",
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
];

function graphWithConnections(connections) {
  return {
    machines,
    external_resources: ["coal", "iron_ore", "water"],
    connections,
  };
}

const catalog = loadCatalog();
const fullResult = evaluateRuntimeGraph(catalog, graphWithConnections(fullConnections));
assert(fullResult.progress.completed_recipes.sink_dirty_water === 1, "Full route should complete sink_dirty_water.");
assert(fullResult.progress.produced_resources.basic_iron_output === 1, "Full route should produce basic_iron_output.");
assert(fullResult.completed_recipes.includes("process_washed_iron_ore"), "Full route should complete processor recipe.");

const objective = evaluateObjectives(catalog, fullResult.progress).find(
  (objectiveResult) => objectiveResult.objective_id === "basic_iron_certification",
);
assert(objective?.complete, "Evaluator progress should complete Basic Iron Certification.");

const missingDirtyWaterHandling = fullConnections.filter((connection) => connection.id !== "washer_to_sink_dirty_water");
const dirtyWaterResult = evaluateRuntimeGraph(catalog, graphWithConnections(missingDirtyWaterHandling));
assert(!dirtyWaterResult.progress.completed_recipes.sink_dirty_water, "Missing Dirty Water handling should not complete sink recipe.");
assert(dirtyWaterResult.progress.produced_resources.basic_iron_output === 1, "Missing Dirty Water handling does not block this minimal fact evaluator yet.");

const missingProcessorRoute = fullConnections.filter((connection) => connection.id !== "washer_to_processor_solid");
const processorResult = evaluateRuntimeGraph(catalog, graphWithConnections(missingProcessorRoute));
assert(!processorResult.progress.produced_resources.basic_iron_output, "Missing processor material route should not produce basic_iron_output.");

const invalidWashedOreSource = fullConnections.map((connection) =>
  connection.id === "washer_to_processor_solid"
    ? { ...connection, source_runtime_machine_id: "crusher_1", source_machine_id: "crusher" }
    : connection,
);
const invalidSourceResult = evaluateRuntimeGraph(catalog, graphWithConnections(invalidWashedOreSource));
assert(
  !invalidSourceResult.progress.produced_resources.basic_iron_output,
  "Processor should not receive washed_iron_ore from a machine that did not produce it.",
);

console.log("Slice 1 runtime graph evaluator checks passed.");
