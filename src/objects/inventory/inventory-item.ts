export class InventoryItem extends Phaser.GameObjects.Container {
	private quantityText: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		frame?: string | number,
	) {
		super(scene, x, y);

		this.setName(texture);
		const sprite = scene.add.sprite(0, 0, texture, frame);
		this.quantityText = scene.add.text(6, 0, "1");

		this.add([sprite, this.quantityText]);
	}

	updateQuantityText(quantity: number) {
		this.quantityText.setText(quantity.toString());
	}
}

export default InventoryItem;
