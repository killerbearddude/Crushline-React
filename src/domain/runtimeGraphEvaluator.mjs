import { checkPortCompatibility } from "./portCompatibility.mjs";

function byId(items) {
  const index = new Map();
  if (!Array.isArray(items)) return index;
  for (const item of items) {
    if (item && typeof item.id === "string") index.set(item.id, item);
  }
  return index;
}

function graphMachines(graph) {
  return Array.isArray(graph?.machines) ? graph.machines : [];
}

function graphConnections(graph) {
  return Array.isArray(graph?.connections) ? graph.connections : [];
}

function graphExternalResources(graph) {
  return Array.isArray(graph?.external_resources) ? new Set(graph.external_resources) : new Set();
}

function machineCatalogId(machine) {
  return machine.catalog_machine_id ?? machine.machine_catalog_id ?? machine.catalog_id;
}

function connectionSourceRuntimeId(connection) {
  return connection.source_runtime_machine_id ?? connection.source_machine_runtime_id ?? connection.source_node_id;
}

function connectionTargetRuntimeId(connection) {
  return connection.target_runtime_machine_id ?? connection.target_machine_runtime_id ?? connection.target_node_id;
}

function machineClassCatalogIds(catalog) {
  const result = new Map();
  for (const machine of catalog?.machines?.machines ?? []) {
    if (!result.has(machine.machine_class)) result.set(machine.machine_class, []);
    result.get(machine.machine_class).push(machine.id);
  }
  return result;
}

function recipes(catalog) {
  return Array.isArray(catalog?.recipes?.recipes) ? catalog.recipes.recipes : [];
}

function recipeOutputs(recipe) {
  return Array.isArray(recipe.outputs) ? recipe.outputs : [];
}

function recipeInputs(recipe) {
  return Array.isArray(recipe.inputs) ? recipe.inputs : [];
}

function compatibleRuntimeConnections(catalog, graph) {
  return graphConnections(graph).filter((connection) => checkPortCompatibility(catalog, connection).compatible);
}

function runtimeMachinesForRecipe(catalog, graph, recipe) {
  const catalogIds = new Set(machineClassCatalogIds(catalog).get(recipe.machine_class) ?? []);
  return graphMachines(graph).filter((machine) => catalogIds.has(machineCatalogId(machine)));
}

function hasIncomingResource(catalog, graph, targetRuntimeId, resourceId, producedResources, externalResources) {
  if (externalResources.has(resourceId)) return true;

  return compatibleRuntimeConnections(catalog, graph).some((connection) => {
    return connectionTargetRuntimeId(connection) === targetRuntimeId && connection.resource_id === resourceId && producedResources.has(resourceId);
  });
}

function canRunRecipe(catalog, graph, recipe, runtimeMachine, producedResources, externalResources) {
  return recipeInputs(recipe).every((input) =>
    hasIncomingResource(catalog, graph, runtimeMachine.id, input.resource_id, producedResources, externalResources),
  );
}

function addRecipeProgress(progress, recipe) {
  progress.completed_recipes[recipe.id] = Math.max(progress.completed_recipes[recipe.id] ?? 0, 1);
  for (const output of recipeOutputs(recipe)) {
    progress.produced_resources[output.resource_id] = Math.max(progress.produced_resources[output.resource_id] ?? 0, output.amount ?? 1);
  }
}

export function evaluateRuntimeGraph(catalog, graph) {
  const producedResources = new Set(graphExternalResources(graph));
  const externalResources = graphExternalResources(graph);
  const progress = {
    produced_resources: {},
    completed_recipes: {},
  };
  const completedRecipes = new Set();

  let changed = true;
  while (changed) {
    changed = false;

    for (const recipe of recipes(catalog)) {
      if (completedRecipes.has(recipe.id)) continue;

      const runnableMachine = runtimeMachinesForRecipe(catalog, graph, recipe).find((runtimeMachine) =>
        canRunRecipe(catalog, graph, recipe, runtimeMachine, producedResources, externalResources),
      );

      if (!runnableMachine) continue;

      completedRecipes.add(recipe.id);
      for (const output of recipeOutputs(recipe)) producedResources.add(output.resource_id);
      addRecipeProgress(progress, recipe);
      changed = true;
    }
  }

  return {
    progress,
    completed_recipes: [...completedRecipes],
    produced_resources: [...producedResources].filter((resourceId) => !externalResources.has(resourceId)),
  };
}
