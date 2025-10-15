import type { Asset } from "./types";

export const assetGroups: Record<string, Asset[]> = {
  "Storage & Tanks": [
    { id: "weighbridge", name: "Weighbridge", type: "storage", group: "Storage & Tanks", icon: "Scale" },
    { id: "labsa-tank-1", name: "Labsa Tank 1", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "labsa-tank-2", name: "Labsa Tank 2", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "labsa-tank-3", name: "Labsa Tank 3", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "caustic-tank-1", name: "Caustic Tank 1", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "caustic-tank-2", name: "Caustic Tank 2", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "cp5-tank-1", name: "CP5 Tank 1", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "cp5-tank-2", name: "CP5 Tank 2", type: "tank", group: "Storage & Tanks", icon: "Container" },
    { id: "cp5-tank-3", name: "CP5 Tank 3", type: "tank", group: "Storage & Tanks", icon: "Container" },
  ],
  "Silos": [
    { id: "pvd-salt-silo-1", name: "PVD Salt Silo 1", type: "silo", group: "Silos", icon: "Cylinder" },
    { id: "pvd-salt-silo-2", name: "PVD Salt Silo 2", type: "silo", group: "Silos", icon: "Cylinder" },
    { id: "scmc-silo-1", name: "SCMC Silo 1", type: "silo", group: "Silos", icon: "Cylinder" },
    { id: "scmc-silo-2", name: "SCMC Silo 2", type: "silo", group: "Silos", icon: "Cylinder" },
    { id: "soda-ash-light-tank-1", name: "Soda Ash Light Tank 1", type: "tank", group: "Silos", icon: "Container" },
  ],
  "BatchPots - Unit 1": [
    { id: "labsa-batchpot-u1", name: "Labsa BatchPot U1", type: "batchpot", group: "BatchPots - Unit 1", icon: "Beaker" },
    { id: "caustic-batchpot-u1", name: "Caustic BatchPot U1", type: "batchpot", group: "BatchPots - Unit 1", icon: "Beaker" },
    { id: "cp5-batchpot-u1", name: "CP5 BatchPot U1", type: "batchpot", group: "BatchPots - Unit 1", icon: "Beaker" },
    { id: "silicate-batchpot-u1", name: "Silicate BatchPot U1", type: "batchpot", group: "BatchPots - Unit 1", icon: "Beaker" },
    { id: "water-batchpot-u1", name: "Water BatchPot U1", type: "batchpot", group: "BatchPots - Unit 1", icon: "Beaker" },
    { id: "soda-ash-light-batchpot-u1", name: "Soda Ash Light BatchPot U1", type: "batchpot", group: "BatchPots - Unit 1", icon: "Beaker" },
  ],
  "BatchPots - Unit 2": [
    { id: "labsa-batchpot-u2", name: "Labsa BatchPot U2", type: "batchpot", group: "BatchPots - Unit 2", icon: "Beaker" },
    { id: "caustic-batchpot-u2", name: "Caustic BatchPot U2", type: "batchpot", group: "BatchPots - Unit 2", icon: "Beaker" },
    { id: "cp5-batchpot-u2", name: "CP5 BatchPot U2", type: "batchpot", group: "BatchPots - Unit 2", icon: "Beaker" },
    { id: "silicate-batchpot-u2", name: "Silicate BatchPot U2", type: "batchpot", group: "BatchPots - Unit 2", icon: "Beaker" },
    { id: "water-batchpot-u2", name: "Water BatchPot U2", type: "batchpot", group: "BatchPots - Unit 2", icon: "Beaker" },
    { id: "carbomil-soda-batchpot-u2", name: "Carbomil Soda Batch Pot U2", type: "batchpot", group: "BatchPots - Unit 2", icon: "Beaker" },
  ],
  "Hoppers": [
    { id: "scmc-way-hopper-u1", name: "SCMC Way Hopper U1", type: "hopper", group: "Hoppers", icon: "Cone" },
    { id: "scmc-way-hopper-u2", name: "SCMC Way Hopper U2", type: "hopper", group: "Hoppers", icon: "Cone" },
    { id: "pvd-salt-way-hopper-u1", name: "PVD Salt Way Hopper U1", type: "hopper", group: "Hoppers", icon: "Cone" },
    { id: "pvd-salt-way-hopper-u2", name: "PVD Salt Way Hopper U2", type: "hopper", group: "Hoppers", icon: "Cone" },
    { id: "db100-way-hopper-u2", name: "DB100 Way Hopper U2", type: "hopper", group: "Hoppers", icon: "Cone" },
    { id: "rework-way-hopper-u2", name: "Rework Way Hopper U2", type: "hopper", group: "Hoppers", icon: "Cone" },
    { id: "base-powder-way-hopper-u1", name: "Base Powder Way Hopper U1", type: "hopper", group: "Hoppers", icon: "Cone" },
  ],
  "Processing": [
    { id: "slurry-mixer-u1", name: "Slurry Mixer U1", type: "mixer", group: "Processing", icon: "Blend" },
    { id: "slurry-mixer-u2", name: "Slurry Mixer U2", type: "mixer", group: "Processing", icon: "Blend" },
    { id: "slurry-holding-tank-u1", name: "Slurry Holding Tank U1", type: "tank", group: "Processing", icon: "Container" },
    { id: "slurry-holding-tank-u2", name: "Slurry Holding Tank U2", type: "tank", group: "Processing", icon: "Container" },
  ],
  "Measurement": [
    { id: "flow-meter-u1", name: "Flow Meter U1", type: "meter", group: "Measurement", icon: "Gauge" },
    { id: "flow-meter-u2", name: "Flow Meter U2", type: "meter", group: "Measurement", icon: "Gauge" },
    { id: "moisture-qty-1", name: "Moisture Qty 1", type: "sensor", group: "Measurement", icon: "Droplet" },
    { id: "moisture-qty-2", name: "Moisture Qty 2", type: "sensor", group: "Measurement", icon: "Droplet" },
  ],
};
