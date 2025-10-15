import { Save, Undo, Redo, RotateCcw, Grid3x3, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const EditorToolbar = () => {
  return (
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
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <Undo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <Redo className="h-5 w-5" />
        </Button>
        <div className="mx-2 h-6 w-px bg-industrial-border" />
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <Grid3x3 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <Moon className="h-5 w-5" />
        </Button>
        <div className="mx-2 h-6 w-px bg-industrial-border" />
        <Button className="bg-gradient-to-r from-neon-blue to-emerald hover:opacity-90">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </motion.header>
  );
};
