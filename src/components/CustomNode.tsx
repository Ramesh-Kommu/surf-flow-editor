import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import * as Icons from "lucide-react";
import type { Asset } from "./types";

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const asset = data as unknown as Asset;
  const IconComponent = Icons[asset.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;

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
