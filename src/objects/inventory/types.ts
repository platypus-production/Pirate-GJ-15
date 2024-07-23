export type Item = {
	name: string;
	description: string;
	chemicalComposition: string | string[];
};
export type ItemInventory = Item & { quantity: number };
export type ItemInventoryMap = Map<string, ItemInventory>;
export type ItemInventoryMapTuple = [string, ItemInventory];
