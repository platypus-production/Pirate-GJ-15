import { COLLISION } from "@constants";
import { Cooldown, isEnemy, isPlayer } from "@utils";
import { type Entity, EntityFollower } from "../base";
import type { Enemy } from "../enemy";
import type { Player } from "../player";

/**
 * Event emitter for weapon-related events.
 */
export const WeaponEventEmitter = new Phaser.Events.EventEmitter();

// @TODO: Create cache File for weapon statistics

/**
 * Represents a weapon in the game.
 * This class manages the weapon's position, rotation, and firing mechanics.
 * @extends EntityFollower<Entity>
 */
export class Weapon extends EntityFollower<Entity> {
	/** The distance from the target entity to position the weapon. */
	private offsetDistance: number;

	/** The angle offset from the target entity's rotation. */
	private offsetAngle: number;

	/** Map of cooldowns for various weapon actions. */
	private cooldowns: Map<string, Cooldown>;

	/** The collision category this weapon targets. */
	public targetCategory: COLLISION;

	/**
	 * Creates a new Weapon instance.
	 * @param scene - The Phaser scene this weapon belongs to.
	 * @param x - Initial x-coordinate of the weapon.
	 * @param y - Initial y-coordinate of the weapon.
	 * @param texture - The texture key for the weapon sprite.
	 * @param bodyConfig - Optional Matter.js body configuration.
	 * @param fireCooldown - Cooldown duration for firing the weapon (in milliseconds).
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig,
		fireCooldown = 200,
	) {
		super({ world: scene.matter.world, x, y, texture, bodyConfig });

		this.offsetDistance = 30;
		this.offsetAngle = Math.PI / 2;

		this.cooldowns = new Map<string, Cooldown>();

		this.cooldowns.set("fire", new Cooldown(scene, fireCooldown));

		this.on("ON_ATTACH", this.defineTargetCategory, this);

		scene.input.on("pointerdown", this.onFire, this);
	}

	/**
	 * Updates the weapon's state each frame.
	 * @param _time - The current time.
	 * @param _delta - The time elapsed since the last update.
	 */
	update(_time: number, _delta: number): void {
		this.onFollowTarget();
		this.updatePosition();
	}

	/**
	 * Updates the weapon's position relative to its target.
	 */
	private updatePosition(): void {
		const totalAngle = this.targetRotation + this.offsetAngle;

		this.x = this.targetPosition.x + Math.cos(totalAngle) * this.offsetDistance;
		this.y = this.targetPosition.y + Math.sin(totalAngle) * this.offsetDistance;

		this.setRotation(this.targetRotation);
	}

	/**
	 * Handles the firing action of the weapon.
	 */
	private onFire(): void {
		this.startCooldown("fire", () => WeaponEventEmitter.emit("ON_FIRE"));
	}

	/**
	 * Defines the target category based on the attached entity.
	 * @param entity - The entity to which the weapon is attached.
	 */
	private defineTargetCategory(entity: Player | Enemy | Entity): void {
		if (isEnemy(entity)) {
			this.targetCategory = COLLISION.PLAYER;
			return;
		}
		if (isPlayer(entity)) {
			this.targetCategory = COLLISION.PLAYER;
			return;
		}

		this.targetCategory = COLLISION.NONE;
	}

	/**
	 * Adds a new cooldown to the weapon.
	 * @param key - The identifier for the cooldown.
	 * @param duration - The duration of the cooldown in milliseconds.
	 *
	 */
	addCooldown(key: string, duration: number): void {
		this.cooldowns.set(key, new Cooldown(this.scene, duration));
	}

	/**
	 * Retrieves a cooldown by its key.
	 * @param key - The identifier of the cooldown.
	 * @returns The Cooldown instance.
	 * @throws Error if the cooldown doesn't exist.
	 */
	getCooldown(key: string): Cooldown {
		if (!this.cooldowns.has(key))
			throw new Error(`Cooldown ${key} doesn't exist.`);
		return this.cooldowns.get(key)!;
	}

	/**
	 * Starts a cooldown and executes a callback when ready.
	 * @param key - The identifier of the cooldown to start.
	 * @param callback - The function to execute when the cooldown is ready.
	 */
	startCooldown(key: string, callback: () => void): void {
		const cooldown = this.getCooldown(key);
		if (!cooldown.isReady) return;
		cooldown.start(callback);
	}

	/**
	 * Checks if a cooldown is ready.
	 * @param key - The identifier of the cooldown to check.
	 * @returns True if the cooldown is ready, false otherwise.
	 */
	getCooldownStatus(key: string): boolean {
		return this.cooldowns.get(key)!.isReady;
	}
}
