import { type Entity, EntityFollower } from "../base";

/**
 * Represents the player's reticle in the game.
 * This class manages the movement and constraints of the reticle relative to its target (typically the player).
 * @extends EntityFollower<Entity>
 */
export class PlayerReticle extends EntityFollower<Entity> {
	/** The Matter.js body type for the reticle. */
	declare body: MatterJS.BodyType;

	/** The active pointer in the scene. */
	private pointer: Phaser.Input.Pointer;

	/** The offset of the reticle from its original position. */
	private offset: Phaser.Math.Vector2;

	/** The maximum allowed distance between the reticle and its target. */
	private readonly MAX_DISTANCE = 275;

	/** The boundaries for the reticle's movement. */
	private readonly BOUNDS = { x: 800, y: 600 };

	/**
	 * Creates an instance of PlayerReticle.
	 * @param scene - The Phaser scene in which the reticle is created.
	 * @param x - The initial x position of the reticle.
	 * @param y - The initial y position of the reticle.
	 * @param texture - Optional. The texture key to use for the reticle sprite. Defaults to "reticle".
	 * @param frame - Optional. The frame of the texture to use. Defaults to 0.
	 * @param bodyConfig - Optional. Additional configuration for the Matter.js body.
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture?: string | Phaser.Textures.Texture,
		frame?: number | string,
		bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig,
	) {
		super({
			world: scene.matter.world,
			x,
			y,
			texture: texture || "reticle",
			frame: frame || 0,
			bodyConfig: { isSensor: true, ...bodyConfig },
		});

		this.pointer = scene.input.activePointer;
		this.offset = new Phaser.Math.Vector2(0, 0);

		scene.input.on("pointermove", this.handlePointerMove, this);
	}

	/**
	 * Updates the reticle's state each frame.
	 * @param _time - The current time.
	 * @param _delta - The time elapsed since the last update.
	 */
	update(_time: number, _delta: number): void {
		if (!this.pointer.locked || !this.targetPosition) return;

		this.onFollowTarget();
		this.updatePosition();
		this.applyConstraints();
	}

	/**
	 * Handles pointer movement.
	 * Updates the reticle's offset based on mouse movement.
	 * @param pointer - The Phaser pointer.
	 */
	private handlePointerMove(pointer: Phaser.Input.Pointer): void {
		if (!pointer.locked) return;

		this.offset.add(
			new Phaser.Math.Vector2(pointer.movementX, pointer.movementY),
		);
		this.constrainOffset();
	}

	/**
	 * Updates the reticle's position based on its target and offset.
	 */
	private updatePosition(): void {
		if (!this.targetPosition) return;

		this.setPosition(
			this.targetPosition.x + this.offset.x,
			this.targetPosition.y + this.offset.y,
		);
	}

	/**
	 * Applies all constraints to the reticle.
	 */
	private applyConstraints(): void {
		this.constrainDistance();
		this.constrainToBounds();
	}

	/**
	 * Constrains the reticle to stay within the maximum allowed distance from its target.
	 */
	private constrainDistance(): void {
		if (!this.targetPosition) return;

		const direction = new Phaser.Math.Vector2(
			this.x - this.targetPosition.x,
			this.y - this.targetPosition.y,
		);
		const distance = direction.length();

		if (distance > this.MAX_DISTANCE) {
			direction.normalize().scale(this.MAX_DISTANCE);
			this.setPosition(
				this.targetPosition.x + direction.x,
				this.targetPosition.y + direction.y,
			);
		}
	}

	/**
	 * Constrains the reticle to stay within the defined boundaries.
	 */
	private constrainToBounds(): void {
		if (!this.targetPosition) return;

		this.x = Phaser.Math.Clamp(
			this.x,
			this.targetPosition.x - this.BOUNDS.x,
			this.targetPosition.x + this.BOUNDS.x,
		);
		this.y = Phaser.Math.Clamp(
			this.y,
			this.targetPosition.y - this.BOUNDS.y,
			this.targetPosition.y + this.BOUNDS.y,
		);
	}

	/**
	 * Constrains the offset to the maximum allowed distance.
	 */
	private constrainOffset(): void {
		const distance = this.offset.length();
		if (distance > this.MAX_DISTANCE) {
			this.offset.normalize().scale(this.MAX_DISTANCE);
		}
	}

	/**
	 * Resets the reticle's offset to zero.
	 */
	public resetOffset(): void {
		this.offset.reset();
	}
}

export default PlayerReticle;
