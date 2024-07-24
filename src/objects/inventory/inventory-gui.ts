import { type Inventory, InventoryEventEmitter } from "./inventory";
import { InventoryItem } from "./inventory-item";
import type { ItemInventory } from "./types";

export class InventoryGUI extends Phaser.GameObjects.Container {
	items: Phaser.GameObjects.Group;

	constructor(scene: Phaser.Scene, x: number, y: number, inventory: Inventory) {
		super(scene, x, y);
		// @TODO: Add texture for inventory

		this.items = this.scene.add.group();

		for (const [, item] of inventory.tuple) {
			this.handleAddItem(item);
		}

		InventoryEventEmitter.on("ON_ADD_ITEM", this.handleAddItem, this);
		InventoryEventEmitter.on("ON_UPDATE_ITEM", this.handleUpdateItem, this);
		InventoryEventEmitter.on("ON_DELETE_ITEM", this.handleUpdateItem, this);
	}

	updateUi() {
		Phaser.Actions.GridAlign(this.items.getChildren(), {
			x: this.x,
			y: this.y,
			width: 5,
			height: 3,
			cellHeight: 40,
			cellWidth: 40,
		});
	}

	handleAddItem(item: ItemInventory) {
		const [newItem] = this.items.createFromConfig({
			key: item.name,
			classType: InventoryItem,
		});
		newItem.updateQuantityText(item.quantity);
		this.updateUi();
	}

	handleUpdateItem(item: ItemInventory) {
		const [itemInInventory] = this.items.getMatching("name", item.name);
		itemInInventory.updateQuantityText(item.quantity);
		this.updateUi();
	}

	handleDeleteItem(name: string) {
		const [itemInInventory] = this.items.getMatching("name", name);
		this.items.remove(itemInInventory);
		this.updateUi();
	}
}

export default InventoryGUI;
