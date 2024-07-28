import type Entity from "./entity";
import { SpriteMatter } from "./sprite-matter";

/**
 * Properties for creating an EntityFollower.
 * @template T The type of entity being followed, extending the base Entity class.
 */
type EntityFollowerProps<T> = {
	/** The Matter.js world in which the follower exists. */
	world: Phaser.Physics.Matter.World;
	/** The initial x-coordinate of the follower. */
	x: number;
	/** The initial y-coordinate of the follower. */
	y: number;
	/** The texture key or Phaser.Textures.Texture object for the follower's sprite. */
	texture: string | Phaser.Textures.Texture;
	/** Optional frame within the texture. */
	frame?: string | number;
	/** Optional target entity to follow. */
	target?: T;
	/** Optional Matter.js body configuration. */
	bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig;
};

/**
 * Represents an entity that can follow another entity.
 * @template T The type of entity being followed, extending the base Entity class.
 * @extends SpriteMatter
 */
export class EntityFollower<T extends Entity> extends SpriteMatter {
	/** The target entity being followed. */
	private _target?: T;

	/** Whether the follower is currently following its target. */
	private isFollowing = false;

	/**
	 * Creates a new EntityFollower instance.
	 * @param props - The properties for creating the EntityFollower.
	 */
	constructor({
		world,
		x,
		y,
		texture,
		frame,
		bodyConfig,
		target,
	}: EntityFollowerProps<T>) {
		super(world, x, y, texture, frame, bodyConfig);
		this._target = target;
	}

	/**
	 * Updates the follower's velocity to match its target's.
	 * If no target is set or following is disabled, velocity is set to zero.
	 */
	onFollowTarget(): void {
		if (!this._target) return;
		if (!this.isFollowing) this.setVelocity(0, 0);
		this.setVelocity(
			this._target.getVelocity().x,
			this._target.getVelocity().y,
		);
	}

	/**
	 * Attaches this follower to a new target entity.
	 * @param entity - The new target entity to follow.
	 * @template K - The type of the new target entity, extending T.
	 */
	attachToTarget<K extends T>(entity: K): void {
		this._target = entity;
		this.emit("ON_ATTACH", entity);
	}

	/**
	 * Detaches this follower from its current target.
	 */
	detachToTarget(): void {
		this._target = undefined;
		this.emit("ON_ATTACH");
	}

	/**
	 * Toggles whether this entity is actively following its target.
	 */
	toggleFollowTarget(): void {
		this.isFollowing = !this.isFollowing;
	}

	/**
	 * Gets the rotation of the target entity.
	 * @returns The rotation of the target entity, or 0 if no target is set.
	 */
	get targetRotation(): number {
		return this._target?.rotation || 0;
	}

	/**
	 * Gets the position of the target entity.
	 * @returns An object containing the x and y coordinates of the target entity, or {x: 0, y: 0} if no target is set.
	 */
	get targetPosition(): { x: number; y: number } {
		return {
			x: this._target?.x || 0,
			y: this._target?.y || 0,
		};
	}

	/**
	 * Gets the size of the target entity.
	 * @returns An object containing the width and height of the target entity, or {width: 0, height: 0} if no target is set.
	 */
	get targetSize(): { width: number; height: number } {
		return {
			width: this._target?.width || 0,
			height: this._target?.height || 0,
		};
	}
}
