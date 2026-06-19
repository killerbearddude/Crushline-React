function progressAmount(progress, collectionName, id) {
  const collection = progress?.[collectionName];
  if (!collection || typeof collection !== "object") return 0;
  const value = collection[id];
  return typeof value === "number" ? value : 0;
}

function evaluateRequirement(requirement, progress) {
  if (requirement.kind === "produced_resource") {
    const currentAmount = progressAmount(progress, "produced_resources", requirement.resource_id);
    const requiredAmount = requirement.minimum_amount ?? 1;
    return {
      complete: currentAmount >= requiredAmount,
      current: currentAmount,
      required: requiredAmount,
      label: `Produce ${requirement.resource_id}`,
    };
  }

  if (requirement.kind === "completed_recipe") {
    const currentRuns = progressAmount(progress, "completed_recipes", requirement.recipe_id);
    const requiredRuns = requirement.minimum_runs ?? 1;
    return {
      complete: currentRuns >= requiredRuns,
      current: currentRuns,
      required: requiredRuns,
      label: `Complete ${requirement.recipe_id}`,
    };
  }

  return {
    complete: false,
    current: 0,
    required: 1,
    label: `Unsupported requirement: ${requirement.kind}`,
  };
}

export function evaluateObjective(objective, progress) {
  const requirements = Array.isArray(objective?.requirements) ? objective.requirements : [];
  const evaluatedRequirements = requirements.map((requirement) => ({
    ...requirement,
    ...evaluateRequirement(requirement, progress),
  }));

  return {
    objective_id: objective.id,
    display_name: objective.display_name,
    description: objective.description,
    complete: evaluatedRequirements.length > 0 && evaluatedRequirements.every((requirement) => requirement.complete),
    requirements: evaluatedRequirements,
  };
}

export function evaluateObjectives(catalog, progress) {
  const objectives = Array.isArray(catalog?.objectives?.objectives) ? catalog.objectives.objectives : [];
  return objectives.map((objective) => evaluateObjective(objective, progress));
}
