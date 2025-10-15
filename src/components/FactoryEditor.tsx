import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AssetLibrary } from "./AssetLibrary";
import { EditorCanvas } from "./EditorCanvas";
import { PropertyPanel } from "./PropertyPanel";
import { EditorToolbar } from "./EditorToolbar";
import type { Asset } from "./types";

export const FactoryEditor = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-industrial-bg">
      <EditorToolbar />
      
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
              <AssetLibrary onCollapse={() => setIsSidebarCollapsed(true)} />
            </motion.div>
          )}
        </AnimatePresence>

        <ReactFlowProvider>
          <EditorCanvas 
            onAssetSelect={setSelectedAsset}
            isSidebarCollapsed={isSidebarCollapsed}
            onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
    </div>
  );
};
