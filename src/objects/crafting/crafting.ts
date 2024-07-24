import type { ElementSymbol } from "@types";
import type { Inventory } from "../inventory";
import type { Item } from "../inventory/types";

export const CraftingEventEmitter = new Phaser.Events.EventEmitter();
export type RecipeTuple = [ElementSymbol, Item];

export class Crafting {
	private _recipes: Record<ElementSymbol, Item>;

	constructor(
		private cache: Phaser.Cache.CacheManager,
		private inventory: Inventory,
	) {
		this._recipes = this.cache.json.get("crafting-recipes");

		CraftingEventEmitter.on("ON_START_CRAFT", this.onCraft);
	}

	public get recipes(): Array<RecipeTuple> {
		return Object.entries(this._recipes) as Array<RecipeTuple>;
	}

	get tuple(): Array<RecipeTuple> {
		return Object.entries(this._recipes) as Array<RecipeTuple>;
	}

	public getAvailableRecipes() {
		return this.tuple.filter(([name]) => this.haveCompoundFor(name));
	}

	getRecipe(recipeName: ElementSymbol) {
		return this._recipes[recipeName];
	}

	private haveCompoundFor(recipeName: ElementSymbol) {
		return Object.entries(this._recipes[recipeName].chemicalCompound).every(
			([symbol, element]) => {
				const elmtSymbol = symbol as ElementSymbol;
				const compoud =
					this.inventory.getAllChemicalCompoundInventory()[elmtSymbol];
				return compoud && element.subscript <= compoud.total;
			},
		);
	}

	private onCraft(recipeName: ElementSymbol, items: string[]) {
		const recipe = this.getRecipe(recipeName);
		for (const name of items) {
			this.inventory.remove(name);
		}
		this.inventory.add({
			name: recipe.name,
			description: recipe.description,
			chemicalCompound: recipe.chemicalCompound,
		});
	}
}

export default Crafting;
