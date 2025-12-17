import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AssetLibrary } from "./AssetLibrary";
import { EditorCanvas } from "./EditorCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { EditorToolbar } from "./EditorToolbar";
import { Toaster } from "@/components/ui/toaster";
import type { Asset } from "./types";

export type EdgeType = "default" | "straight" | "step";

export const FactoryEditor = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [edgeType, setEdgeType] = useState<EdgeType>("default");
  const [usedAssetIds, setUsedAssetIds] = useState<string[]>([]);
  const [hasSelectedEdge, setHasSelectedEdge] = useState(false);
  const canvasRef = useRef<any>(null);

  // Poll for selected edge state
  const checkSelectedEdge = () => {
    const hasEdge = canvasRef.current?.hasSelectedEdge?.() || false;
    setHasSelectedEdge(hasEdge);
  };

  return (
    <div 
      className={`flex h-screen w-full flex-col overflow-hidden ${isDarkTheme ? 'bg-industrial-bg' : 'bg-gray-50'}`}
      onClick={checkSelectedEdge}
    >
      <EditorToolbar 
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        onGridToggle={() => setShowGrid(!showGrid)}
        onZoomIn={() => canvasRef.current?.zoomIn()}
        onZoomOut={() => canvasRef.current?.zoomOut()}
        onReset={() => canvasRef.current?.resetLayout()}
        onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
        onUploadJSON={() => canvasRef.current?.uploadJSON()}
        onDownloadJSON={() => canvasRef.current?.downloadJSON()}
        onDeleteLink={() => {
          canvasRef.current?.deleteSelectedEdge();
          setHasSelectedEdge(false);
        }}
        showGrid={showGrid}
        isDarkTheme={isDarkTheme}
        edgeType={edgeType}
        onEdgeTypeChange={setEdgeType}
        hasSelectedEdge={hasSelectedEdge}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-80 border-r border-industrial-border"
            >
              <AssetLibrary 
                onCollapse={() => setIsSidebarCollapsed(true)}
                usedAssetIds={usedAssetIds}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ReactFlowProvider>
          <EditorCanvas 
            ref={canvasRef}
            onAssetSelect={setSelectedAsset}
            isSidebarCollapsed={isSidebarCollapsed}
            onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            showGrid={showGrid}
            edgeType={edgeType}
            isDarkTheme={isDarkTheme}
            onUsedAssetsChange={setUsedAssetIds}
          />
        </ReactFlowProvider>

        <AnimatePresence mode="wait">
          {selectedAsset && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-96 border-l border-industrial-border"
            >
              <PropertyPanel 
                asset={selectedAsset}
                onClose={() => setSelectedAsset(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
};
