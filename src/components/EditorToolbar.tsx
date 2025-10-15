import { Save, Undo, Redo, RotateCcw, Grid3x3, Moon, Sun, Upload, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import type { EdgeType } from "./FactoryEditor";

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onGridToggle: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onThemeToggle: () => void;
  onUploadJSON: () => void;
  onDownloadJSON: () => void;
  showGrid: boolean;
  isDarkTheme: boolean;
  edgeType: EdgeType;
  onEdgeTypeChange: (type: EdgeType) => void;
}

export const EditorToolbar = ({
  onUndo,
  onRedo,
  onGridToggle,
  onZoomIn,
  onZoomOut,
  onReset,
  onThemeToggle,
  onUploadJSON,
  onDownloadJSON,
  showGrid,
  isDarkTheme,
  edgeType,
  onEdgeTypeChange,
}: EditorToolbarProps) => {
  return (
    <TooltipProvider>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel sticky top-0 z-50 flex h-16 items-center justify-between border-b border-industrial-border px-6"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon-blue to-emerald" />
            <h1 className="bg-gradient-to-r from-neon-blue to-emerald bg-clip-text text-xl font-bold text-transparent">
              Factory Loss Graphical Editor
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onUploadJSON}
              >
                <Upload className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onDownloadJSON}
              >
                <Download className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download JSON</TooltipContent>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-industrial-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onUndo}
              >
                <Undo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onRedo}
              >
                <Redo className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-industrial-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onZoomIn}
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onZoomOut}
              >
                <ZoomOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onReset}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Layout</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`hover:bg-primary/10 hover:text-primary ${showGrid ? 'text-primary' : ''}`}
                onClick={onGridToggle}
              >
                <Grid3x3 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary/10 hover:text-primary"
                onClick={onThemeToggle}
              >
                {isDarkTheme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Theme</TooltipContent>
          </Tooltip>

          <div className="mx-2 h-6 w-px bg-industrial-border" />

          <Select value={edgeType} onValueChange={(value) => onEdgeTypeChange(value as EdgeType)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-[140px] bg-card/50 border-industrial-border">
                  <SelectValue placeholder="Arrow Style" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Connection Style</TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectItem value="default">Curved</SelectItem>
              <SelectItem value="straight">Straight</SelectItem>
              <SelectItem value="step">Square</SelectItem>
            </SelectContent>
          </Select>

          <div className="mx-2 h-6 w-px bg-industrial-border" />

          <Button className="bg-gradient-to-r from-neon-blue to-emerald hover:opacity-90">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </motion.header>
    </TooltipProvider>
  );
};
