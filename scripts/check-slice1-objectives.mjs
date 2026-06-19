import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateObjectives } from "../src/domain/objectiveProgress.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(path) {
  return JSON.parse(readFileSync(resolve(root, path), "utf8"));
}

function loadCatalog() {
  return {
    objectives: readJson("catalog/slice1_objectives.json"),
  };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function objectiveResult(progress) {
  const results = evaluateObjectives(loadCatalog(), progress);
  const result = results.find((objective) => objective.objective_id === "basic_iron_certification");
  assert(result, "Expected Basic Iron Certification objective result.");
  return result;
}

function expectComplete(name, progress, expected) {
  const result = objectiveResult(progress);
  assert(result.complete === expected, `${name}: expected complete=${expected}.`);
  return result;
}

expectComplete("empty progress", {}, false);
expectComplete(
  "dirty water only",
  {
    completed_recipes: { sink_dirty_water: 1 },
  },
  false,
);
expectComplete(
  "basic iron only",
  {
    produced_resources: { basic_iron_output: 1 },
  },
  false,
);
const completeResult = expectComplete(
  "complete objective",
  {
    produced_resources: { basic_iron_output: 1 },
    completed_recipes: { sink_dirty_water: 1 },
  },
  true,
);
assert(
  completeResult.requirements.every((requirement) => requirement.complete),
  "Complete objective should mark every requirement complete.",
);

console.log("Slice 1 objective progress checks passed.");
