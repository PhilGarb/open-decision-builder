import create from "zustand";
import produce from "immer";
import {
  coordinates,
  edge,
  edges,
  node,
  nodes,
  nodeTypes,
  portTypes,
} from "../types";
import { merge } from "remeda";
import { devtools } from "zustand/middleware";

type EditorConfig = {
  zoom: number;
  coordinates: coordinates;
  id: number;
};

export type EditorState = {
  editorConfig: EditorConfig;
  setEditorConfig: (editorConfig: Partial<EditorConfig>) => void;
};

export const useEditorStore = create<EditorState>(
  devtools(
    (set) => ({
      editorConfig: {
        zoom: 1,
        coordinates: [0, 0],
        initialized: false,
        id: 1234,
      },
      setEditorConfig: (editorConfig) =>
        set(
          produce((state: EditorState) => {
            state.editorConfig = merge(state.editorConfig, editorConfig);
          })
        ),
    }),
    "Editor"
  )
);

export type NodesState = {
  nodes: nodes;
  nodeTypes: nodeTypes;
  portTypes: portTypes;
  setNodes: (nodes: nodes, nodeTypes: nodeTypes, portTypes: portTypes) => void;
  addNode: (nodeType: string, coordinates: coordinates, id: string) => void;
  removeNode: (nodeId: string) => void;
  setNode: (id: string, node: node) => void;
};

export const useNodesStore = create<NodesState>(
  devtools(
    (set) => ({
      nodes: {},
      nodeTypes: {},
      portTypes: {},
      setNodes: (nodes, nodeTypes, portTypes) =>
        set({
          nodes: Object.entries(nodes).reduce((acc: nodes, node) => {
            acc[node[0]] = { ...node[1] };
            return acc;
          }, {}),
          nodeTypes,
          portTypes,
        }),
      addNode: (nodeType, coordinates, id) =>
        set(
          produce((state: NodesState) => {
            state.nodes[id] = {
              coordinates,
              type: nodeType,
              width: 250,
              height: 100,
            };
          })
        ),
      removeNode: (nodeId) =>
        set(
          produce((state: NodesState) => {
            delete state.nodes[nodeId];
          })
        ),
      setNode: (id, node) =>
        set(
          produce((state: NodesState) => {
            state.nodes[id] = node;
          })
        ),
    }),
    "Nodes"
  )
);

export type EdgesState = {
  edges: edges;
  setEdges: (edges: edges) => void;
  setEdgeData: (
    data: Partial<edge>,
    originNodeId: string,
    destinationNodeId: string
  ) => void;
  addEdge: (originNodeId: string, destinationNodeId: string) => void;
};

export const useEdgesStore = create<EdgesState>(
  devtools(
    (set) => ({
      edges: {},
      setEdges: (edges) => set({ edges }),
      setEdgeData: (data, originNodeId, destinationNodeId) =>
        set(
          produce((state: EdgesState) => {
            const edge = state.edges[originNodeId].find(
              (edge) => edge.nodeId === destinationNodeId
            );
            const edgeIndex = state.edges[originNodeId].findIndex(
              (edge) => edge.nodeId === destinationNodeId
            );

            if (edgeIndex && edge)
              state.edges[originNodeId][edgeIndex] = { ...edge, ...data };
          })
        ),
      addEdge: (originNodeId, destinationNodeId) =>
        set(
          produce((state: EdgesState) => {
            if (!state.edges[originNodeId]) state.edges[originNodeId] = [];

            state.edges[originNodeId].push({
              nodeId: destinationNodeId,
            });
          })
        ),
    }),
    "Edges"
  )
);
