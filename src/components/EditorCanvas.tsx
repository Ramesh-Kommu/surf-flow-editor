import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomNode } from "./CustomNode";
import type { Asset } from "./types";

const nodeTypes = {
  custom: CustomNode,
};

interface EditorCanvasProps {
  onAssetSelect: (asset: Asset | null) => void;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

export const EditorCanvas = ({ onAssetSelect, isSidebarCollapsed, onSidebarToggle }: EditorCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const asset: Asset = JSON.parse(data);
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }) || { x: 0, y: 0 };

      const newNode: Node = {
        id: `${asset.id}-${Date.now()}`,
        type: "custom",
        position,
        data: { ...asset },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const asset = node.data as unknown as Asset;
      onAssetSelect(asset);
    },
    [onAssetSelect]
  );

  return (
    <div ref={reactFlowWrapper} className="relative flex-1 h-full">
      {isSidebarCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4 z-10"
        >
          <Button
            onClick={onSidebarToggle}
            size="icon"
            className="bg-card/70 backdrop-blur-xl hover:bg-card"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </motion.div>
      )}

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-neon-blue/20 to-emerald/20 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-neon-blue to-emerald opacity-50 animate-glow-pulse" />
              </div>
            </div>
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Drag assets from the left panel to begin building your process
            </p>
            <p className="text-sm text-muted-foreground/60">
              Connect assets to define the factory workflow
            </p>
          </motion.div>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-industrial-bg"
      >
        <Background
          color="hsl(var(--industrial-border))"
          gap={20}
          size={1}
          className="opacity-30"
        />
        <Controls className="bg-card border-industrial-border" />
        <MiniMap
          className="bg-card/70 backdrop-blur-xl border border-industrial-border"
          nodeColor={(node) => {
            return "hsl(var(--primary))";
          }}
        />
      </ReactFlow>
    </div>
  );
};
