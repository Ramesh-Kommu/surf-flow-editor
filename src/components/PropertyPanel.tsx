import { useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Asset } from "./types";

interface PropertyPanelProps {
  asset: Asset;
  onClose: () => void;
}

export const PropertyPanel = ({ asset, onClose }: PropertyPanelProps) => {
  const [assetData, setAssetData] = useState(asset);

  return (
    <div className="flex h-full flex-col glass-panel">
      <div className="flex items-center justify-between border-b border-industrial-border p-4">
        <h2 className="text-lg font-semibold text-foreground">Properties</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-muted/50 transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset-name">Asset Name</Label>
            <Input
              id="asset-name"
              value={assetData.name}
              onChange={(e) =>
                setAssetData({ ...assetData, name: e.target.value })
              }
              className="bg-industrial-surface border-industrial-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone-name">Zone Name</Label>
            <Input
              id="zone-name"
              value={assetData.zone || ""}
              onChange={(e) =>
                setAssetData({ ...assetData, zone: e.target.value })
              }
              placeholder="Enter zone name"
              className="bg-industrial-surface border-industrial-border focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone-inout">Zone In/Out</Label>
            <Select
              value={assetData.zoneInOut}
              onValueChange={(value: "In" | "Out") =>
                setAssetData({ ...assetData, zoneInOut: value })
              }
            >
              <SelectTrigger className="bg-industrial-surface border-industrial-border focus:border-primary">
                <SelectValue placeholder="Select zone direction" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-industrial-border">
                <SelectItem value="In">In</SelectItem>
                <SelectItem value="Out">Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t border-industrial-border pt-4">
          <Tabs defaultValue="t1" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-industrial-surface">
              <TabsTrigger value="t1" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                T1
              </TabsTrigger>
              <TabsTrigger value="t2" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                T2
              </TabsTrigger>
            </TabsList>

            <TabsContent value="t1" className="space-y-4 mt-4">
              <TagConfiguration tabName="T1" />
            </TabsContent>

            <TabsContent value="t2" className="space-y-4 mt-4">
              <TagConfiguration tabName="T2" />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="border-t border-industrial-border p-4">
        <Button className="w-full bg-gradient-to-r from-neon-blue to-emerald hover:opacity-90">
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

const TagConfiguration = ({ tabName }: { tabName: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor={`tag-name-${tabName}`}>Tag Name</Label>
        <Input
          id={`tag-name-${tabName}`}
          placeholder="Enter tag name"
          className="bg-industrial-surface border-industrial-border focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`tag-zone-${tabName}`}>Zone In/Out</Label>
        <Select>
          <SelectTrigger className="bg-industrial-surface border-industrial-border focus:border-primary">
            <SelectValue placeholder="Select zone direction" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-industrial-border">
            <SelectItem value="In">In</SelectItem>
            <SelectItem value="Out">Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`calc-type-${tabName}`}>Calculation Type</Label>
        <Select>
          <SelectTrigger className="bg-industrial-surface border-industrial-border focus:border-primary">
            <SelectValue placeholder="Select calculation type" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-industrial-border">
            <SelectItem value="Addition">Addition</SelectItem>
            <SelectItem value="Subtraction">Subtraction</SelectItem>
            <SelectItem value="Ratio">Ratio</SelectItem>
            <SelectItem value="Average">Average</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};
