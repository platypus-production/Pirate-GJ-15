import type { ElementDetails } from "@types";

export type Item = {
	name: string;
	description: string;
	chemicalCompound: Partial<ElementDetails>;
};
export type ItemInventory = Item & { quantity: number };
export type ItemInventoryMap = Map<string, ItemInventory>;
export type ItemInventoryMapTuple = [string, ItemInventory];
