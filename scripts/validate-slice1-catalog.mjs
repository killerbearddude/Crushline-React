import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const files = {
  resources: "catalog/slice1_resources.json",
  machines: "catalog/slice1_machines.json",
  recipes: "catalog/slice1_recipes.json",
  objectives: "catalog/slice1_objectives.json",
  diagnostics: "catalog/slice1_diagnostics.json",
};

const allowedDiagnosticSeverities = new Set(["blocking", "warning", "info"]);

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isString = (value) => typeof value === "string" && value.length > 0;

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(root, relativePath), "utf8"));
}

export function loadSlice1Catalog() {
  return {
    resources: readJson(files.resources),
    machines: readJson(files.machines),
    recipes: readJson(files.recipes),
    objectives: readJson(files.objectives),
    diagnostics: readJson(files.diagnostics),
  };
}

function arraySection(file, key, errors) {
  if (!isObject(file) || !Array.isArray(file[key])) {
    errors.push(`${key}: expected top-level array "${key}".`);
    return [];
  }
  return file[key];
}

function indexById(items, label, errors) {
  const index = new Map();
  for (const [position, item] of items.entries()) {
    if (!isObject(item) || !isString(item.id)) {
      errors.push(`${label}[${position}]: missing non-empty string id.`);
      continue;
    }
    if (index.has(item.id)) {
      errors.push(`${label}: duplicate id "${item.id}".`);
      continue;
    }
    index.set(item.id, item);
  }
  return index;
}

function validatePort(port, machineId, position, resourceIds, errors) {
  const label = `machines:${machineId}.ports[${position}]`;
  if (!isObject(port)) {
    errors.push(`${label}: expected object.`);
    return;
  }
  for (const key of ["id", "display_name", "direction", "kind"]) {
    if (!isString(port[key])) errors.push(`${label}: missing ${key}.`);
  }
  if (port.accepted_resources !== undefined) {
    if (!Array.isArray(port.accepted_resources)) {
      errors.push(`${label}: accepted_resources must be an array.`);
    } else {
      for (const resourceId of port.accepted_resources) {
        if (!resourceIds.has(resourceId)) {
          errors.push(`${label}: accepted_resources references missing resource "${resourceId}".`);
        }
      }
    }
  }
}

function validateRecipeResources(recipe, key, resourceIds, errors) {
  const recipeId = isString(recipe.id) ? recipe.id : "<missing id>";
  if (!Array.isArray(recipe[key])) {
    errors.push(`recipes:${recipeId}: ${key} must be an array.`);
    return;
  }
  for (const [position, entry] of recipe[key].entries()) {
    const label = `recipes:${recipeId}.${key}[${position}]`;
    if (!isObject(entry) || !isString(entry.resource_id)) {
      errors.push(`${label}: missing resource_id.`);
      continue;
    }
    if (!resourceIds.has(entry.resource_id)) {
      errors.push(`${label}: references missing resource "${entry.resource_id}".`);
    }
  }
}

function validateRequirement(requirement, objectiveId, position, resourceIds, recipeIds, errors) {
  const label = `objectives:${objectiveId}.requirements[${position}]`;
  if (!isObject(requirement) || !isString(requirement.kind)) {
    errors.push(`${label}: missing kind.`);
    return;
  }
  if (requirement.kind === "produced_resource" || requirement.kind === "connected_waste_output") {
    if (!isString(requirement.resource_id) || !resourceIds.has(requirement.resource_id)) {
      errors.push(`${label}: references missing resource "${requirement.resource_id}".`);
    }
    return;
  }
  if (requirement.kind === "completed_recipe") {
    if (!isString(requirement.recipe_id) || !recipeIds.has(requirement.recipe_id)) {
      errors.push(`${label}: references missing recipe "${requirement.recipe_id}".`);
    }
    return;
  }
  errors.push(`${label}: unsupported requirement kind "${requirement.kind}".`);
}

function validateDiagnostic(diagnostic, position, errors) {
  const id = isObject(diagnostic) && isString(diagnostic.id) ? diagnostic.id : `<missing id at ${position}>`;
  const label = `diagnostics:${id}`;

  if (!isObject(diagnostic)) {
    errors.push(`diagnostics[${position}]: expected object.`);
    return;
  }

  for (const key of ["id", "severity", "title", "message", "repair_hint"]) {
    if (!isString(diagnostic[key])) {
      errors.push(`${label}: missing non-empty string ${key}.`);
    }
  }

  if (isString(diagnostic.severity) && !allowedDiagnosticSeverities.has(diagnostic.severity)) {
    errors.push(`${label}: unsupported severity "${diagnostic.severity}".`);
  }

  if (diagnostic.condition !== undefined) {
    errors.push(`${label}: must not define executable condition logic.`);
  }
}

export function validateSlice1Catalog(catalog) {
  const errors = [];
  const resources = arraySection(catalog.resources, "resources", errors);
  const machines = arraySection(catalog.machines, "machines", errors);
  const recipes = arraySection(catalog.recipes, "recipes", errors);
  const objectives = arraySection(catalog.objectives, "objectives", errors);
  const diagnostics = arraySection(catalog.diagnostics, "diagnostics", errors);

  const resourceIds = new Set(indexById(resources, "resources", errors).keys());
  const machineIndex = indexById(machines, "machines", errors);
  const recipeIndex = indexById(recipes, "recipes", errors);
  indexById(objectives, "objectives", errors);
  indexById(diagnostics, "diagnostics", errors);

  const machineClasses = new Set();
  for (const machine of machineIndex.values()) {
    if (!isString(machine.machine_class)) {
      errors.push(`machines:${machine.id}: missing machine_class.`);
    } else {
      machineClasses.add(machine.machine_class);
    }
    if (!Array.isArray(machine.ports)) {
      errors.push(`machines:${machine.id}: ports must be an array.`);
      continue;
    }
    machine.ports.forEach((port, position) => validatePort(port, machine.id, position, resourceIds, errors));
  }

  for (const recipe of recipeIndex.values()) {
    if (!isString(recipe.machine_class) || !machineClasses.has(recipe.machine_class)) {
      errors.push(`recipes:${recipe.id}: references missing machine_class "${recipe.machine_class}".`);
    }
    validateRecipeResources(recipe, "inputs", resourceIds, errors);
    validateRecipeResources(recipe, "outputs", resourceIds, errors);
  }

  const recipeIds = new Set(recipeIndex.keys());
  for (const objective of objectives) {
    if (!isObject(objective) || !isString(objective.id)) continue;
    if (!Array.isArray(objective.requirements)) {
      errors.push(`objectives:${objective.id}: requirements must be an array.`);
      continue;
    }
    objective.requirements.forEach((requirement, position) =>
      validateRequirement(requirement, objective.id, position, resourceIds, recipeIds, errors),
    );
  }

  diagnostics.forEach((diagnostic, position) => validateDiagnostic(diagnostic, position, errors));

  return errors;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function selfTest(catalog) {
  const failures = [];

  const missingResource = clone(catalog);
  missingResource.recipes.recipes[0].inputs[0].resource_id = "missing_resource_for_test";
  if (!validateSlice1Catalog(missingResource).some((error) => error.includes("missing_resource_for_test"))) {
    failures.push("missing resource reference was not detected");
  }

  const missingMachineClass = clone(catalog);
  missingMachineClass.recipes.recipes[0].machine_class = "missing_machine_class_for_test";
  if (!validateSlice1Catalog(missingMachineClass).some((error) => error.includes("missing_machine_class_for_test"))) {
    failures.push("missing machine class reference was not detected");
  }

  const duplicateDiagnostic = clone(catalog);
  duplicateDiagnostic.diagnostics.diagnostics.push({ ...duplicateDiagnostic.diagnostics.diagnostics[0] });
  if (!validateSlice1Catalog(duplicateDiagnostic).some((error) => error.includes("duplicate id"))) {
    failures.push("duplicate diagnostic id was not detected");
  }

  const badDiagnosticSeverity = clone(catalog);
  badDiagnosticSeverity.diagnostics.diagnostics[0].severity = "critical_for_test";
  if (!validateSlice1Catalog(badDiagnosticSeverity).some((error) => error.includes("critical_for_test"))) {
    failures.push("invalid diagnostic severity was not detected");
  }

  const missingDiagnosticText = clone(catalog);
  delete missingDiagnosticText.diagnostics.diagnostics[0].repair_hint;
  if (!validateSlice1Catalog(missingDiagnosticText).some((error) => error.includes("repair_hint"))) {
    failures.push("missing diagnostic repair_hint was not detected");
  }

  return failures;
}

function main() {
  const catalog = loadSlice1Catalog();
  const errors = validateSlice1Catalog(catalog);
  if (errors.length > 0) {
    console.error("Slice 1 catalog validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  if (process.argv.includes("--self-test")) {
    const failures = selfTest(catalog);
    if (failures.length > 0) {
      console.error("Slice 1 catalog validator self-test failed:");
      for (const failure of failures) console.error(`- ${failure}`);
      process.exit(1);
    }
    console.log("Slice 1 catalog validator self-test passed.");
  }

  console.log(
    `Slice 1 catalog validation passed: ${catalog.resources.resources.length} resources, ${catalog.machines.machines.length} machines, ${catalog.recipes.recipes.length} recipes, ${catalog.objectives.objectives.length} objective, ${catalog.diagnostics.diagnostics.length} diagnostics.`,
  );
}

main();
