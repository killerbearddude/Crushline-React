import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkPortCompatibility } from "../src/domain/portCompatibility.mjs";

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

function connection(sourceMachine, sourcePort, targetMachine, targetPort, resource) {
  return {
    source_machine_id: sourceMachine,
    source_port_id: sourcePort,
    target_machine_id: targetMachine,
    target_port_id: targetPort,
    resource_id: resource,
  };
}

function expectCompatible(catalog, name, candidate) {
  const result = checkPortCompatibility(catalog, candidate);
  if (!result.compatible) {
    throw new Error(`${name}: expected compatible, got:\n${result.errors.join("\n")}`);
  }
}

function expectIncompatible(catalog, name, candidate, expectedText) {
  const result = checkPortCompatibility(catalog, candidate);
  if (result.compatible) {
    throw new Error(`${name}: expected incompatible, got compatible.`);
  }
  if (!result.errors.some((error) => error.includes(expectedText))) {
    throw new Error(`${name}: expected error containing "${expectedText}", got:\n${result.errors.join("\n")}`);
  }
}

const catalog = loadCatalog();

expectCompatible(
  catalog,
  "generator powers crusher",
  connection("basic_generator", "power_output", "crusher", "power_input", "power"),
);

expectCompatible(
  catalog,
  "crusher feeds washer",
  connection("crusher", "solid_output", "washer", "solid_input", "crushed_iron_ore"),
);

expectCompatible(
  catalog,
  "washer sends dirty water to waste sink",
  connection("washer", "dirty_water_output", "waste_sink", "waste_input", "dirty_water"),
);

expectIncompatible(
  catalog,
  "input cannot be used as source",
  connection("crusher", "solid_input", "washer", "solid_input", "iron_ore"),
  "must be an output port",
);

expectIncompatible(
  catalog,
  "power cannot connect to solid input",
  connection("basic_generator", "power_output", "crusher", "solid_input", "power"),
  "Port kind mismatch",
);

expectIncompatible(
  catalog,
  "processed ore cannot feed crusher input",
  connection("washer", "solid_output", "crusher", "solid_input", "washed_iron_ore"),
  "cannot accept resource",
);

console.log("Slice 1 port compatibility checks passed.");
