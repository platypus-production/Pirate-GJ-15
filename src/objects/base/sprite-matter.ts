/**
 * Extends Phaser's Matter.js sprite with additional functionality.
 * This class provides a way to create and manipulate sprites with Matter.js physics.
 * @extends Phaser.Physics.Matter.Sprite
 */
export class SpriteMatter extends Phaser.Physics.Matter.Sprite {
	/**
	 * The Matter.js body associated with this sprite.
	 * This property is declared to ensure TypeScript recognizes it as a Matter.js body type.
	 */
	declare body: MatterJS.BodyType;

	/**
	 * Sets the origin of the body relative to its position.
	 * This method allows for adjusting the center of mass of the body.
	 *
	 * @param x - The x-coordinate of the new origin relative to the body's position.
	 * @param y - The y-coordinate of the new origin. If not provided, it defaults to the same value as x.
	 * @returns This SpriteMatter instance for method chaining.
	 *
	 * @example
	 * // Set the body origin to (0.5, 0.5)
	 * spriteMatter.setBodyOrigin(0.5);
	 *
	 * @example
	 * // Set the body origin to (0.3, 0.7)
	 * spriteMatter.setBodyOrigin(0.3, 0.7);
	 */
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
