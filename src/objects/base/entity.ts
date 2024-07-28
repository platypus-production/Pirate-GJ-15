import type { FunctionWithUnknowArgs } from "@types";
import { SpriteMatter } from "./sprite-matter";

/**
 * Properties for creating an Entity.
 */
type EntityProps = {
	/** The Phaser scene in which the entity exists. */
	scene: Phaser.Scene;
	/** The initial x-coordinate of the entity. */
	x: number;
	/** The initial y-coordinate of the entity. */
	y: number;
	/** The texture key or Phaser.Textures.Texture object for the entity's sprite. */
	texture: string | Phaser.Textures.Texture;
	/** Optional frame within the texture. */
	frame?: string | number;
	/** Optional stats for the entity. Currently only includes speed. */
	stats?: { speed: number };
};

/**
 * Represents a game entity with physical properties and basic behaviors.
 * @extends SpriteMatter
 */
export class Entity extends SpriteMatter {
	/** The stats of the entity, including speed. */
	private stats: NonNullable<EntityProps["stats"]>;

	/** Whether the entity is currently alive. */
	private _isAlive = true;

	/**
	 * Creates a new Entity instance.
	 * @param world - The Matter.js world in which the entity exists.
	 * @param x - The initial x-coordinate of the entity.
	 * @param y - The initial y-coordinate of the entity.
	 * @param texture - The texture key or Phaser.Textures.Texture object for the entity's sprite.
	 * @param frame - Optional frame within the texture.
	 * @param bodyConfig - Optional Matter.js body configuration.
	 * @param stats - Optional stats for the entity. If not provided, default speed is 10.
	 */
	constructor(
		world: Phaser.Physics.Matter.World,
		x: number,
		y: number,
		texture: string | Phaser.Textures.Texture,
		frame?: string | number,
		bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig,
		stats?: { speed: number },
	) {
		super(world, x, y, texture, frame, bodyConfig);
		this.stats = {
			...stats,
			speed: stats?.speed ?? 10,
		};
	}

	/**
	 * Moves the entity based on the given axes.
	 * @param axes - An object containing x and y values representing movement direction.
	 */
	onMove(axes: Record<"x" | "y", -1 | 0 | 1>): void {
		const normalize = new Phaser.Math.Vector2(
			axes.x * this.stats.speed,
			axes.y * this.stats.speed,
		)
			.normalize()
			.scale(this.stats.speed);

		this.setVelocity(normalize.x, normalize.y);
	}

	/**
	 * Handles the death of the entity.
	 * @param callback - Optional function to call upon death.
	 */
	onDeath(callback?: FunctionWithUnknowArgs): void {
		if (this.isAlive) this._isAlive = false;
		if (callback) {
			callback();
		}
		this.destroy();
	}

	/**
	 * Gets whether the entity is currently alive.
	 * @returns True if the entity is alive, false otherwise.
	 */
	get isAlive(): boolean {
		return this._isAlive;
	}
}

export default Entity;
