import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AssetCard } from "./AssetCard";
import { assetGroups } from "./assetData";

interface AssetLibraryProps {
  onCollapse: () => void;
}

export const AssetLibrary = ({ onCollapse }: AssetLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    Object.keys(assetGroups)
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );
  };

  const filteredGroups = Object.entries(assetGroups).reduce(
    (acc, [groupName, assets]) => {
      const filtered = assets.filter((asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[groupName] = filtered;
      }
      return acc;
    },
    {} as typeof assetGroups
  );

  return (
    <div className="flex h-full flex-col glass-panel">
      <div className="flex items-center justify-between border-b border-industrial-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Asset Library</h2>
        <button
          onClick={onCollapse}
          className="rounded-lg p-1 hover:bg-muted/50 transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-industrial-surface border-industrial-border focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {Object.entries(filteredGroups).map(([groupName, assets]) => (
          <div key={groupName} className="mb-3">
            <button
              onClick={() => toggleGroup(groupName)}
              className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-muted/30 transition-colors"
            >
              <span className="font-medium text-sm text-foreground">
                {groupName}
              </span>
              {expandedGroups.includes(groupName) ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expandedGroups.includes(groupName) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2"
              >
                {assets.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} />
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
