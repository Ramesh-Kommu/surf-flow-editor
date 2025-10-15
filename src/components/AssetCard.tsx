import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { Asset } from "./types";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard = ({ asset }: AssetCardProps) => {
  const IconComponent = Icons[asset.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(asset));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group relative cursor-grab active:cursor-grabbing rounded-lg bg-industrial-surface border border-industrial-border p-3 hover:border-primary/50 transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98] transition-transform"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-blue/0 to-emerald/0 group-hover:from-neon-blue/5 group-hover:to-emerald/5 transition-all duration-200" />
      
      <div className="relative flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {asset.name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {asset.type}
          </p>
        </div>
      </div>
    </div>
  );
};
