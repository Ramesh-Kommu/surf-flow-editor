import { useCallback, useState, useRef, forwardRef, useImperativeHandle } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CustomNode } from "./CustomNode";
import type { Asset } from "./types";
import type { EdgeType } from "./FactoryEditor";

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const nodeWidth = 220;
  const nodeHeight = 100;
  const horizontalSpacing = 300;
  const verticalSpacing = 150;

  const layoutedNodes = nodes.map((node, index) => {
    const col = index % 4;
    const row = Math.floor(index / 4);
    
    return {
      ...node,
      position: {
        x: col * horizontalSpacing + 100,
        y: row * verticalSpacing + 100,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const nodeTypes = {
  custom: CustomNode,
};

interface EditorCanvasProps {
  onAssetSelect: (asset: Asset | null) => void;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  showGrid: boolean;
  edgeType: EdgeType;
  isDarkTheme: boolean;
}

export interface EditorCanvasRef {
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetLayout: () => void;
  uploadJSON: () => void;
  downloadJSON: () => void;
}

export const EditorCanvas = forwardRef<EditorCanvasRef, EditorCanvasProps>(
  ({ onAssetSelect, isSidebarCollapsed, onSidebarToggle, showGrid, edgeType, isDarkTheme }, ref) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const { toast } = useToast();
    const { zoomIn: rfZoomIn, zoomOut: rfZoomOut, fitView } = useReactFlow();

  const saveToHistory = useCallback(() => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [nodes, edges, history, currentStep]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, type: edgeType, animated: true }, eds));
      saveToHistory();
    },
    [setEdges, edgeType, saveToHistory]
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
      saveToHistory();
    },
    [reactFlowInstance, setNodes, saveToHistory]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const asset = node.data as unknown as Asset;
      onAssetSelect(asset);
    },
    [onAssetSelect]
  );

  useImperativeHandle(ref, () => ({
    undo: () => {
      if (currentStep > 0) {
        const prevState = history[currentStep - 1];
        setNodes(prevState.nodes);
        setEdges(prevState.edges);
        setCurrentStep(currentStep - 1);
        toast({ title: "Undo successful", description: "Reverted to previous state" });
      }
    },
    redo: () => {
      if (currentStep < history.length - 1) {
        const nextState = history[currentStep + 1];
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
        setCurrentStep(currentStep + 1);
        toast({ title: "Redo successful", description: "Restored next state" });
      }
    },
    zoomIn: () => {
      rfZoomIn({ duration: 300 });
    },
    zoomOut: () => {
      rfZoomOut({ duration: 300 });
    },
    resetLayout: () => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setTimeout(() => fitView({ duration: 500 }), 100);
      toast({ title: "Layout reset", description: "Assets auto-arranged" });
    },
    uploadJSON: () => {
      fileInputRef.current?.click();
    },
    downloadJSON: () => {
      const data = {
        nodes,
        edges,
        timestamp: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factory-config-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: "Download complete", description: "Configuration saved successfully" });
    },
  }), [currentStep, history, nodes, edges, setNodes, setEdges, rfZoomIn, rfZoomOut, fitView, toast]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          setTimeout(() => fitView({ duration: 500 }), 100);
          toast({ title: "Upload successful", description: "Configuration loaded" });
          saveToHistory();
        } else {
          toast({ 
            title: "Invalid file", 
            description: "JSON file must contain nodes and edges",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({ 
          title: "Upload failed", 
          description: "Invalid JSON file format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div ref={reactFlowWrapper} className="relative flex-1 h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="hidden"
      />
      
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
        className={isDarkTheme ? "bg-industrial-bg" : "bg-gray-50"}
      >
        {showGrid && (
          <Background
            color={isDarkTheme ? "hsl(var(--industrial-border))" : "#e5e7eb"}
            gap={20}
            size={1}
            className="opacity-30"
          />
        )}
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
});

EditorCanvas.displayName = "EditorCanvas";
