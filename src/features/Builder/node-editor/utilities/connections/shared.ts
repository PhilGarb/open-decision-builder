import { curveBasis, line } from "d3-shape";
import { Connection, coordinates } from "../../types";
import { connectionCoordinates, connectionPorts } from "./types";

export const calculateCurve = (
  connectionCoordinates: connectionCoordinates
): string | null => {
  const [origin, destination] = connectionCoordinates;
  const length = destination[0] - origin[0];
  const thirdLength = length / 3;

  return line().curve(curveBasis)([
    [origin[0], origin[1]],
    [origin[0] + thirdLength, origin[1]],
    [origin[0] + thirdLength * 2, destination[1]],
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
  connection: Connection,
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

export const getConnectionCoordinates = (
  zoom: number,
  connectionPorts: connectionPorts,
  stageRect: React.MutableRefObject<DOMRect>,
  portHalf: number,
  stageCoordinates: coordinates
): connectionCoordinates => {
  const byScale = (value: number) => (1 / zoom) * value;
  const [originPort, destinationPort] = connectionPorts;

  const destination: coordinates = [
    byScale(
      destinationPort.x -
        stageRect.current.x +
        (portHalf - stageRect.current.width / 2)
    ) - byScale(stageCoordinates[0]),
    byScale(
      destinationPort.y -
        stageRect.current.y +
        (portHalf - stageRect.current.height / 2)
    ) - byScale(stageCoordinates[1]),
  ];

  const origin: coordinates = [
    byScale(
      originPort.x -
        stageRect.current.x +
        portHalf -
        stageRect.current.width / 2
    ) - byScale(stageCoordinates[0]),
    byScale(
      originPort.y -
        stageRect.current.y +
        portHalf -
        stageRect.current.height / 2
    ) - byScale(stageCoordinates[1]),
  ];

  return [origin, destination];
};
