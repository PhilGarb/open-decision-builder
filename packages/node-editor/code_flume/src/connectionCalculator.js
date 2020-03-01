export const getPortRect = (nodeId, portName, transputType="input") =>
  document
    .querySelector(`[data-node-id="${nodeId}"] [data-port-name="${portName}"][data-port-transput-type="${transputType}"]`)
    .getBoundingClientRect();

export const getPortRectsByNodes = (nodes, forEachConnection) =>
  Object.values(nodes).reduce((obj, node) => {
    if (node.connections && node.connections.inputs) {
      Object.entries(node.connections.inputs).forEach(([inputName, outputs]) => {
        outputs.forEach(output => {
          const toRect = getPortRect(node.id, inputName);
          const fromRect = getPortRect(output.nodeId, output.portName, 'output');
          if(forEachConnection){
            forEachConnection({
              to: toRect,
              from: fromRect,
              name: output.nodeId + output.portName + node.id + inputName
            })
          }
          obj[node.id + inputName] = toRect;
          obj[output.nodeId + output.portName] = fromRect;
        })
      });
    }
    return obj;
  }, {});
