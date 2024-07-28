import { COLLISION } from "@constants";
import { Entity } from "../base";
import { InputManager } from "../input";
import { type Weapon, WeaponRanged } from "../weapon";
import PlayerReticle from "./player-reticle";

/**
 * Represents the player entity in the game.
 * Manages player movement, weapon handling, and interaction with the reticle.
 * @extends Entity
 */
export class Player extends Entity {
	/** Manages player input. */
	private inputManager: InputManager;

	/** The player's aiming reticle. */
	private reticle: PlayerReticle;

	/** The player's current weapon. */
	private weapon: Weapon | null = null;

	/**
	 * Creates a new Player instance.
	 * @param scene - The Phaser scene this player belongs to.
	 * @param x - Initial x-coordinate of the player.
	 * @param y - Initial y-coordinate of the player.
	 */
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene.matter.world, x, y, "dummy-cube", 0, {
			label: "player",
			collisionFilter: {
				group: COLLISION.PLAYER,
				mask: COLLISION.ENEMY | COLLISION.BULLET,
			},
		});

		this.inputManager = new InputManager(scene);

		this.reticle = new PlayerReticle(scene, x, y + 50);
		this.reticle.attachToTarget(this);

		this.weapon = new WeaponRanged(scene, x, y, this.reticle);
		this.weapon.attachToTarget(this);
	}

	/**
	 * Updates the player's state each frame.
	 * Handles movement, reticle updates, and weapon updates.
	 * @param _time - The current time.
	 * @param _delta - The time elapsed since the last update.
	 */
	update(_time: number, _delta: number): void {
		this.onMove(this.inputManager.axes);
		this.reticle.update(_time, _delta);
		this.startFollowReticle();

		if (this.weapon) this.weapon.update(_time, _delta);
	}

	/**
	 * Rotates the player to follow the reticle.
	 */
	private startFollowReticle(): void {
		const angle = Phaser.Math.Angle.Between(
			this.x,
			this.y,
			this.reticle.x,
			this.reticle.y,
		);

		this.setRotation(angle - Math.PI / 2);
	}
}

export default Player;
