function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === "string" && value.length > 0;
}

function byId(items) {
  const index = new Map();
  if (!Array.isArray(items)) return index;
  for (const item of items) {
    if (isObject(item) && hasText(item.id)) index.set(item.id, item);
  }
  return index;
}

function resourceTags(resource) {
  return Array.isArray(resource.tags) ? resource.tags : [];
}

function portAllowsResource(port, resource) {
  if (Array.isArray(port.accepted_resources) && !port.accepted_resources.includes(resource.id)) {
    return false;
  }

  if (Array.isArray(port.accepted_states) && !port.accepted_states.includes(resource.state)) {
    return false;
  }

  if (Array.isArray(port.accepted_tags)) {
    const tags = resourceTags(resource);
    if (!port.accepted_tags.some((tag) => tags.includes(tag))) {
      return false;
    }
  }

  return true;
}

function getCatalogIndexes(catalog) {
  return {
    resources: byId(catalog?.resources?.resources),
    machines: byId(catalog?.machines?.machines),
  };
}

function findPort(machine, portId) {
  if (!Array.isArray(machine.ports)) return undefined;
  return machine.ports.find((port) => port.id === portId);
}

export function checkPortCompatibility(catalog, connection) {
  const errors = [];
  const indexes = getCatalogIndexes(catalog);

  const sourceMachine = indexes.machines.get(connection.source_machine_id);
  if (!sourceMachine) {
    errors.push(`Missing source machine "${connection.source_machine_id}".`);
  }

  const targetMachine = indexes.machines.get(connection.target_machine_id);
  if (!targetMachine) {
    errors.push(`Missing target machine "${connection.target_machine_id}".`);
  }

  const resource = indexes.resources.get(connection.resource_id);
  if (!resource) {
    errors.push(`Missing resource "${connection.resource_id}".`);
  }

  if (!sourceMachine || !targetMachine || !resource) {
    return { compatible: false, errors };
  }

  const sourcePort = findPort(sourceMachine, connection.source_port_id);
  if (!sourcePort) {
    errors.push(`Missing source port "${connection.source_port_id}" on machine "${connection.source_machine_id}".`);
  }

  const targetPort = findPort(targetMachine, connection.target_port_id);
  if (!targetPort) {
    errors.push(`Missing target port "${connection.target_port_id}" on machine "${connection.target_machine_id}".`);
  }

  if (!sourcePort || !targetPort) {
    return { compatible: false, errors };
  }

  if (sourcePort.direction !== "output") {
    errors.push(`Source port "${connection.source_port_id}" must be an output port.`);
  }

  if (targetPort.direction !== "input") {
    errors.push(`Target port "${connection.target_port_id}" must be an input port.`);
  }

  if (sourcePort.kind !== targetPort.kind) {
    errors.push(`Port kind mismatch: source is "${sourcePort.kind}" but target is "${targetPort.kind}".`);
  }

  if (!portAllowsResource(sourcePort, resource)) {
    errors.push(`Source port "${connection.source_port_id}" cannot carry resource "${connection.resource_id}".`);
  }

  if (!portAllowsResource(targetPort, resource)) {
    errors.push(`Target port "${connection.target_port_id}" cannot accept resource "${connection.resource_id}".`);
  }

  return { compatible: errors.length === 0, errors };
}

export function assertPortCompatible(catalog, connection) {
  const result = checkPortCompatibility(catalog, connection);
  if (!result.compatible) {
    throw new Error(result.errors.join("\n"));
  }
  return result;
}
