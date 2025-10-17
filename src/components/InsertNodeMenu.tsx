import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { assetGroups } from "./assetData";
import type { Asset } from "./types";

interface InsertNodeMenuProps {
  onInsertAsset: (asset: Asset) => void;
  onClose: () => void;
  usedAssetIds: string[];
}

export const InsertNodeMenu = ({ onInsertAsset, onClose, usedAssetIds }: InsertNodeMenuProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all assets from groups
  const allAssets = Object.values(assetGroups).flat();

  // Filter available assets (not already used)
  const availableAssets = allAssets.filter(asset => !usedAssetIds.includes(asset.id));

  const filteredAssets = availableAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 rounded-xl border-2 border-primary shadow-2xl glass-panel"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-industrial-border">
        <h3 className="text-lg font-semibold text-foreground mb-3">Insert Asset</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-industrial-surface border-industrial-border"
            autoFocus
          />
        </div>
      </div>

      <ScrollArea className="h-96 p-4">
        <div className="space-y-2">
          {filteredAssets.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No available assets found
            </p>
          ) : (
            filteredAssets.map((asset) => {
              const IconComponent = Icons[asset.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;
              
              return (
                <motion.button
                  key={asset.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onInsertAsset(asset)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-industrial-surface border border-industrial-border hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{asset.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-industrial-border">
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};
