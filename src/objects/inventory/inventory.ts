import type {
	Item,
	ItemInventory,
	ItemInventoryMap,
	ItemInventoryMapTuple,
} from "./types";

export const InventoryEventEmitter = new Phaser.Events.EventEmitter();

export class Inventory {
	private list: ItemInventoryMap;

	constructor() {
		this.list = new Map<string, ItemInventory>();
		InventoryEventEmitter.on("ON_DELETE_ITEM", this.delete);
	}

	add(item: Item) {
		if (!this.list.has(item.name)) {
			this.addNew(item);
			return;
		}
		const inventoryItem = this.list.get(item.name)!;
		this.list.set(item.name, {
			...inventoryItem,
			quantity: inventoryItem.quantity + 1,
		});

		InventoryEventEmitter.emit("ON_UPDATE_ITEM", inventoryItem);
	}

	remove(name: string) {
		if (!this.list.has(name)) return;

		const item = this.list.get(name)!;
		item.quantity--;

		InventoryEventEmitter.emit("ON_UPDATE_ITEM", item);

		if (item.quantity < 1) InventoryEventEmitter.emit("ON_DELETE_ITEM", name);
	}

	delete(name: string) {
		this.list.delete(name);
	}

	private addNew({ name, description, chemicalComposition }: Item) {
		this.list.set(name, {
			quantity: 1,
			name,
			description,
			chemicalComposition,
		});

		InventoryEventEmitter.emit("ON_ADD_ITEM", this.list.get(name));
	}

	getByKey(name: string) {
		return this.list.get(name);
	}

	get itemsName(): Array<string> {
		return this.tuple.map(([name]) => name);
	}

	get tuple(): Array<ItemInventoryMapTuple> {
		return Array.from(this.list);
	}
}
