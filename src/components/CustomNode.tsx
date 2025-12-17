import { memo } from "react";
import { Handle, Position, type NodeProps, useReactFlow } from "@xyflow/react";
import * as Icons from "lucide-react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Asset } from "./types";

interface CustomNodeData extends Asset {
  onDelete?: (nodeId: string) => void;
}

export const CustomNode = memo(({ data, selected, id }: NodeProps) => {
  const asset = data as unknown as CustomNodeData;
  const IconComponent = Icons[asset.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;
  const { deleteElements } = useReactFlow();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div
      className={`
        relative min-w-[200px] rounded-xl border-2 p-4 shadow-lg transition-all
        ${
          selected
            ? "border-primary shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
            : "border-industrial-border hover:border-primary/50"
        }
      `}
      style={{
        background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--industrial-surface)) 100%)",
      }}
    >
      {/* Delete Button - appears on selection */}
      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{ duration: 0.15 }}
            onClick={handleDelete}
            className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border-2 !border-primary-foreground !w-3 !h-3"
      />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
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
    </div>
  );
});

CustomNode.displayName = "CustomNode";
