import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import type { Asset } from "./types";

interface NodeData extends Asset {
  isHighlighted?: boolean;
}

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as NodeData;
  const asset = nodeData as Asset;
  const isHighlighted = nodeData.isHighlighted;
  const IconComponent = Icons[asset.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;

  return (
    <motion.div
      animate={isHighlighted ? {
        boxShadow: [
          "0 0 20px hsl(var(--primary)/0.4)",
          "0 0 40px hsl(var(--primary)/0.8)",
          "0 0 20px hsl(var(--primary)/0.4)",
        ],
        scale: [1, 1.02, 1],
      } : {}}
      transition={isHighlighted ? {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
      className={`
        relative min-w-[200px] rounded-xl border-2 p-4 shadow-lg transition-all
        ${
          isHighlighted
            ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.6)] ring-2 ring-primary/50"
            : selected
            ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
            : "border-industrial-border hover:border-primary/50"
        }
      `}
      style={{
        background: isHighlighted 
          ? "linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--card)) 50%, hsl(var(--industrial-surface)) 100%)"
          : "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--industrial-surface)) 100%)",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border-2 !border-primary-foreground !w-3 !h-3"
      />

      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${isHighlighted ? 'bg-primary/40' : 'bg-primary/20'}`}>
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {asset.name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {asset.type}
          </p>
        </div>
      </div>

      {asset.zone && (
        <div className="mt-2 pt-2 border-t border-industrial-border">
          <p className="text-xs text-muted-foreground">
            Zone: <span className="text-foreground">{asset.zone}</span>
          </p>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-secondary !border-2 !border-secondary-foreground !w-3 !h-3"
      />
    </motion.div>
  );
});

CustomNode.displayName = "CustomNode";
