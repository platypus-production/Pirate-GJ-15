export class SpriteMatter extends Phaser.Physics.Matter.Sprite {
	declare body: MatterJS.BodyType;

	setBodyOrigin(x: number, y?: number): this {
		this.scene.matter.body.setCentre(
			this.body,
			{
				x: x,
				y: y || x,
			},
			true,
		);
		return this;
	}
}
