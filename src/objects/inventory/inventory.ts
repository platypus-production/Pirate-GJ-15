import type { ElementCount, ElementSymbol } from "@types";
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
		InventoryEventEmitter.on("ON_DELETE_ITEM", this.delete, this);
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

		InventoryEventEmitter.emit("ON_UPDATE_ITEM", inventoryItem, this);
	}

	remove(name: string) {
		if (!this.list.has(name)) return;

		const item = this.list.get(name)!;
		item.quantity--;

		InventoryEventEmitter.emit("ON_UPDATE_ITEM", item, this);

		if (item.quantity === 0)
			InventoryEventEmitter.emit("ON_DELETE_ITEM", name, this);
	}

	delete(name: string) {
		this.list.delete(name);
	}

	private addNew({ name, description, chemicalCompound }: Item) {
		this.list.set(name, {
			quantity: 1,
			name,
			description,
			chemicalCompound,
		});

		InventoryEventEmitter.emit("ON_ADD_ITEM", this.list.get(name));
	}

	getByKey(name: string) {
		return this.list.get(name);
	}

	getAllChemicalCompoundInventory() {
		return this.tuple.reduce<ElementCount>((acc, [, item]) => {
			for (const [symbol, element] of Object.entries(item.chemicalCompound)) {
				const elmtSymbol = symbol as ElementSymbol;
				if (acc[elmtSymbol]) {
					acc[elmtSymbol].total += element.subscript;
				} else {
					acc[elmtSymbol] = {
						name: element.name,
						total: element.subscript * item.quantity,
					};
				}
			}
			return acc;
		}, {} as ElementCount);
	}

	get itemsName(): Array<string> {
		return this.tuple.map(([name]) => name);
	}

	get tuple(): Array<ItemInventoryMapTuple> {
		return Array.from(this.list);
	}
}

export default Inventory;
