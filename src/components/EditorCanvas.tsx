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
  MarkerType,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CustomNode } from "./CustomNode";
import { InsertNodeMenu } from "./InsertNodeMenu";
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
  onUsedAssetsChange?: (usedAssetIds: string[]) => void;
}

export interface EditorCanvasRef {
  undo: () => void;
  redo: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetLayout: () => void;
  uploadJSON: () => void;
  downloadJSON: () => void;
  hasSelectedEdge: () => boolean;
  deleteSelectedEdge: () => void;
}

export const EditorCanvas = forwardRef<EditorCanvasRef, EditorCanvasProps>(
  ({ onAssetSelect, isSidebarCollapsed, onSidebarToggle, showGrid, edgeType, isDarkTheme, onUsedAssetsChange }, ref) => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
    const [history, setHistory] = useState<{ nodes: Node[], edges: Edge[] }[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [showInsertMenu, setShowInsertMenu] = useState(false);
    const { toast } = useToast();
    const { zoomIn: rfZoomIn, zoomOut: rfZoomOut, fitView } = useReactFlow();

    // Track used asset IDs and notify parent
    const updateUsedAssets = useCallback((currentNodes: Node[]) => {
      const usedAssetIds = currentNodes.map(node => {
        const asset = node.data as unknown as Asset;
        return asset.id;
      });
      onUsedAssetsChange?.(usedAssetIds);
    }, [onUsedAssetsChange]);

  // Debounced save to history to prevent spam during drag operations
  const saveToHistoryDebounced = useCallback(() => {
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push({ nodes, edges });
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
  }, [nodes, edges, history, currentStep]);

  // Immediate save for important actions
  const saveToHistory = useCallback(() => {
    saveToHistoryDebounced();
  }, [saveToHistoryDebounced]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ 
        ...params, 
        type: edgeType, 
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: 'hsl(var(--primary))',
        },
        style: {
          strokeWidth: 2,
          stroke: 'hsl(var(--primary))',
        }
      }, eds));
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
      
      // Check if asset is already used
      const isUsed = nodes.some(node => {
        const nodeAsset = node.data as unknown as Asset;
        return nodeAsset.id === asset.id;
      });

      if (isUsed) {
        toast({
          title: "Asset already in use",
          description: "Delete the existing node to reuse this asset",
          variant: "destructive"
        });
        return;
      }

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

      setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);
        updateUsedAssets(updatedNodes);
        return updatedNodes;
      });
      saveToHistory();
    },
    [reactFlowInstance, setNodes, saveToHistory, nodes, toast, updateUsedAssets]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const asset = node.data as unknown as Asset;
      onAssetSelect(asset);
      setSelectedEdge(null);
      setShowInsertMenu(false);
    },
    [onAssetSelect]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setShowInsertMenu(true);
      onAssetSelect(null);
    },
    [onAssetSelect]
  );

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null);
    setShowInsertMenu(false);
  }, []);

  // Custom handler for node changes to track deletions and movements
  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    
    // Check if any nodes were removed or added
    const hasRemoval = changes.some((change: any) => change.type === 'remove');
    const hasSelection = changes.some((change: any) => change.type === 'select');
    const hasDimensions = changes.some((change: any) => change.type === 'dimensions');
    
    if (hasRemoval) {
      // Update used assets after removal and save to history
      setTimeout(() => {
        setNodes((currentNodes) => {
          updateUsedAssets(currentNodes);
          return currentNodes;
        });
        saveToHistory();
      }, 0);
    }
    
    // Don't save history for selection or dimension changes
    if (!hasSelection && !hasDimensions && !hasRemoval) {
      // For position changes, debounce to avoid spam
      const hasPosition = changes.some((change: any) => change.type === 'position' && !change.dragging);
      if (hasPosition) {
        saveToHistory();
      }
    }
  }, [onNodesChange, setNodes, updateUsedAssets, saveToHistory]);

  useImperativeHandle(ref, () => ({
    undo: () => {
      if (currentStep > 0) {
        const prevState = history[currentStep - 1];
        setNodes(prevState.nodes);
        setEdges(prevState.edges);
        updateUsedAssets(prevState.nodes);
        setCurrentStep(currentStep - 1);
        setTimeout(() => fitView({ duration: 300 }), 50);
        toast({ title: "Undo successful", description: "Reverted to previous state" });
      } else {
        toast({ title: "Nothing to undo", variant: "destructive" });
      }
    },
    redo: () => {
      if (currentStep < history.length - 1) {
        const nextState = history[currentStep + 1];
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
        updateUsedAssets(nextState.nodes);
        setCurrentStep(currentStep + 1);
        setTimeout(() => fitView({ duration: 300 }), 50);
        toast({ title: "Redo successful", description: "Restored next state" });
      } else {
        toast({ title: "Nothing to redo", variant: "destructive" });
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
      saveToHistory();
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
    hasSelectedEdge: () => !!selectedEdge,
    deleteSelectedEdge: () => {
      if (!selectedEdge) return;
      setEdges((eds) => eds.filter(e => e.id !== selectedEdge.id));
      setSelectedEdge(null);
      setShowInsertMenu(false);
      saveToHistory();
      toast({ title: "Connection deleted", description: "Link removed successfully" });
    },
  }), [currentStep, history, nodes, edges, setNodes, setEdges, rfZoomIn, rfZoomOut, fitView, toast, updateUsedAssets, saveToHistory, selectedEdge]);

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
          updateUsedAssets(data.nodes);
          saveToHistory();
          setTimeout(() => fitView({ duration: 500 }), 100);
          toast({ title: "Upload successful", description: "Configuration loaded" });
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

  const handleInsertAsset = useCallback((asset: Asset) => {
    if (!selectedEdge) return;

    const sourceNode = nodes.find(n => n.id === selectedEdge.source);
    const targetNode = nodes.find(n => n.id === selectedEdge.target);
    
    if (!sourceNode || !targetNode) return;

    // Calculate position between source and target
    const newPosition = {
      x: (sourceNode.position.x + targetNode.position.x) / 2,
      y: (sourceNode.position.y + targetNode.position.y) / 2,
    };

    const newNode: Node = {
      id: `${asset.id}-${Date.now()}`,
      type: "custom",
      position: newPosition,
      data: { ...asset },
    };

    // Remove old edge and create two new edges
    setEdges((eds) => {
      const filtered = eds.filter(e => e.id !== selectedEdge.id);
      return [
        ...filtered,
        {
          id: `e-${selectedEdge.source}-${newNode.id}`,
          source: selectedEdge.source,
          target: newNode.id,
          type: edgeType,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: 'hsl(var(--primary))',
          },
          style: {
            strokeWidth: 2,
            stroke: 'hsl(var(--primary))',
          }
        },
        {
          id: `e-${newNode.id}-${selectedEdge.target}`,
          source: newNode.id,
          target: selectedEdge.target,
          type: edgeType,
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: 'hsl(var(--primary))',
          },
          style: {
            strokeWidth: 2,
            stroke: 'hsl(var(--primary))',
          }
        }
      ];
    });

    setNodes((nds) => {
      const updatedNodes = nds.concat(newNode);
      updateUsedAssets(updatedNodes);
      return updatedNodes;
    });

    setShowInsertMenu(false);
    setSelectedEdge(null);
    saveToHistory();
    
    toast({
      title: "Asset inserted",
      description: "Node added between connection"
    });
  }, [selectedEdge, nodes, setEdges, setNodes, edgeType, updateUsedAssets, saveToHistory, toast]);

  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdge) return;
    
    setEdges((eds) => eds.filter(e => e.id !== selectedEdge.id));
    setSelectedEdge(null);
    setShowInsertMenu(false);
    saveToHistory();
    
    toast({
      title: "Connection deleted",
      description: "Link removed successfully"
    });
  }, [selectedEdge, setEdges, saveToHistory, toast]);

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
        edges={edges.map(edge => ({
          ...edge,
          className: selectedEdge?.id === edge.id ? 'selected-edge' : '',
        }))}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
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

      {/* Insert Node Menu */}
      <AnimatePresence>
        {showInsertMenu && selectedEdge && (
          <InsertNodeMenu
            onInsertAsset={handleInsertAsset}
            onClose={() => {
              setShowInsertMenu(false);
              setSelectedEdge(null);
            }}
            usedAssetIds={nodes.map(n => (n.data as unknown as Asset).id)}
          />
        )}
      </AnimatePresence>

      {/* Action Buttons on Selected Edge */}
      {selectedEdge && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="pointer-events-auto flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-industrial-border shadow-lg">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-primary/20 hover:bg-primary/40 text-primary"
              onClick={() => setShowInsertMenu(true)}
              title="Insert node"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-destructive/20 hover:bg-destructive/40 text-destructive"
              onClick={handleDeleteEdge}
              title="Delete connection"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

EditorCanvas.displayName = "EditorCanvas";
