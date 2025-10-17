import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Asset } from "./types";

interface AssetCardProps {
  asset: Asset;
  isUsed?: boolean;
}

export const AssetCard = ({ asset, isUsed = false }: AssetCardProps) => {
  const IconComponent = Icons[asset.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;

  const onDragStart = (event: React.DragEvent) => {
    if (isUsed) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("application/reactflow", JSON.stringify(asset));
    event.dataTransfer.effectAllowed = "move";
  };

  const cardContent = (
    <div
      draggable={!isUsed}
      onDragStart={onDragStart}
      className={`
        group relative rounded-lg bg-industrial-surface border border-industrial-border p-3 
        transition-all duration-200
        ${isUsed 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-grab active:cursor-grabbing hover:border-primary/50 hover:scale-[1.02] hover:translate-x-1 active:scale-[0.98]'
        }
      `}
    >
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-neon-blue/0 to-emerald/0 ${!isUsed && 'group-hover:from-neon-blue/5 group-hover:to-emerald/5'} transition-all duration-200`} />
      
      <div className="relative flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${isUsed ? 'bg-muted' : 'bg-primary/10 group-hover:bg-primary/20'} transition-colors`}>
          <IconComponent className={`h-5 w-5 ${isUsed ? 'text-muted-foreground' : 'text-primary'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isUsed ? 'text-muted-foreground' : 'text-foreground'}`}>
            {asset.name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {asset.type}
          </p>
        </div>
      </div>
    </div>
  );

  if (isUsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {cardContent}
          </TooltipTrigger>
          <TooltipContent>
            <p>Already used in layout — delete existing node to reuse</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
};
