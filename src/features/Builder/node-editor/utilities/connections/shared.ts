import { curveBasis, line } from "d3-shape";
import { connectionCoordinates, connectionPorts, edge } from "../../types";

export const calculateCurve = (
  connectionCoordinates: connectionCoordinates
): string | null => {
  const [origin, destination] = connectionCoordinates;

  return line().curve(curveBasis)([
    [origin[0], origin[1]],
    [origin[0] - 50, origin[1]],
    [destination[0] + 50, destination[1]],
    [destination[0], destination[1]],
  ]);
};

const getPort = (nodeId: string, portName: string, portType = "input") =>
  document.querySelector(
    `[data-node-id="${nodeId}"] [data-port-name="${portName}"][data-port-transput-type="${portType}"]`
  );

export const getPortRect = (
  nodeId: string,
  portName: string,
  portType = "input"
): DOMRect | undefined =>
  getPort(nodeId, portName, portType)?.getBoundingClientRect();

export const getConnectionPorts = (
  connection: edge,
  isOutput: boolean,
  nodeId: string,
  portName: string
): connectionPorts | undefined => {
  const originPort = getPortRect(
    connection.nodeId,
    connection.portName,
    isOutput ? "input" : "output"
  );

  const destinationPort = getPortRect(
    nodeId,
    portName,
    isOutput ? "output" : "input"
  );

  if (!originPort || !destinationPort) return;
  return [originPort, destinationPort];
};
