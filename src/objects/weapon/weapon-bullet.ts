import { COLLISION } from "@constants";
import { toEntity } from "@utils";
import { SpriteMatter } from "../base/sprite-matter";

/**
 * Represents a bullet in the game.
 * Handles bullet movement, collision, and lifetime.
 * @extends SpriteMatter
 */
export class Bullet extends SpriteMatter {
	/** Maximum time-to-live for the bullet in milliseconds. */
	private readonly maxTTL = 1000;

	/** Current time-to-live for the bullet. */
	private ttl = 0;

	/** Base speed of the bullet. */
	private speed = 1.5;

	/** Horizontal speed component of the bullet. */
	private xSpeed: number;

	/** Vertical speed component of the bullet. */
	private ySpeed: number;

	/**
	 * Creates a new Bullet instance.
	 * @param scene - The Phaser scene this bullet belongs to.
	 * @param x - Initial x-coordinate of the bullet.
	 * @param y - Initial y-coordinate of the bullet.
	 * @param texture - The texture key for the bullet sprite.
	 * @param frame - Optional frame within the texture.
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		frame?: string | number,
	) {
		super(scene.matter.world, x, y, texture, frame, {
			label: "bullet",
			isSensor: true,
		});

		this.setOnCollide(this.onCollide.bind(this));
	}

	/**
	 * Updates the bullet's position and checks its lifetime.
	 * @param _time - The current time.
	 * @param _delta - The time elapsed since the last update.
	 */
	update(_time: number, _delta: number): void {
		this.setVelocity(this.xSpeed * _delta, this.ySpeed * _delta);
		this.ttl += _delta;
		if (this.ttl > this.maxTTL) this.destroy();
	}

	/**
	 * Fires the bullet from a starting point towards a target point.
	 * @param from - The starting position and rotation of the bullet.
	 * @param to - The target position for the bullet.
	 */
	fire(
		from: Phaser.Types.Math.Vector2Like & { rotation: number },
		to: Phaser.Types.Math.Vector2Like,
	): void {
		this.setPosition(from.x, from.y);
		const direction = Math.atan((to.x - this.x) / (to.y - this.y));
		const speed = to.y >= this.y ? this.speed : -this.speed;

		this.xSpeed = speed * Math.sin(direction);
		this.ySpeed = speed * Math.cos(direction);

		this.rotation = from.rotation;
	}

	/**
	 * Handles collision events for the bullet.
	 * @param param0 - Object containing the colliding bodies.
	 */
	onCollide({
		bodyA,
		bodyB,
	}: Record<"bodyA" | "bodyB", MatterJS.BodyType>): void {
		if (
			bodyA.collisionFilter.category === this.body.collisionFilter.mask &&
			bodyB.collisionFilter.category === this.body.collisionFilter.category
		) {
			const entity = toEntity(bodyA.gameObject);
			entity.onDeath();
			this.destroy();
		}
	}

	/**
	 * Sets the collision filter for the bullet.
	 * @param payload - The collision category to set.
	 */
	setCollistionFilter(payload: COLLISION): void {
		this.body.collisionFilter = {
			...this.body.collisionFilter,
			category: payload,
			mask: payload === COLLISION.ENEMY ? COLLISION.PLAYER : COLLISION.ENEMY,
		};
	}
}
