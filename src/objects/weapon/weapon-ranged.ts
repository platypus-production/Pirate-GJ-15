import { Weapon, WeaponEventEmitter } from "./weapon";
import { Bullet } from "./weapon-bullet";

/**
 * Represents a ranged weapon in the game.
 * This class extends the base Weapon class to implement ranged attack functionality.
 * @extends Weapon
 */
export class WeaponRanged extends Weapon {
	/** Group containing bullet entities for this weapon. */
	private mag: Phaser.GameObjects.Group;

	/**
	 * Creates a new WeaponRanged instance.
	 * @param scene - The Phaser scene this weapon belongs to.
	 * @param x - Initial x-coordinate of the weapon.
	 * @param y - Initial y-coordinate of the weapon.
	 * @param reticlePos - The position of the reticle (aiming point) in the scene.
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private reticlePos: MatterJS.Vector,
	) {
		super(scene, x, y, "weapon-ranged");

		this.mag = scene.add.group({
			key: "bullet",
			classType: Bullet,
			runChildUpdate: true,
			createCallback: (entity) => {
				(entity as Bullet).setCollistionFilter(this.targetCategory);
			},
		});

		WeaponEventEmitter.on("ON_FIRE", this.handleFire, this);

		this.addCooldown("reload", 1000);

		this.setData("ammo", 5);
	}

	/**
	 * Handles the firing action of the weapon.
	 * Creates and fires a bullet if conditions are met.
	 */
	handleFire(): void {
		if (!this.getCooldownStatus("reload")) return;

		const bullet = this.mag.get().setActive(true).setVisible(true) as Bullet;

		bullet.fire(
			{ ...this.targetPosition, rotation: this.targetRotation },
			{ x: this.reticlePos.x, y: this.reticlePos.y },
		);

		this.incData("ammo", -1);

		if (this.getData("ammo") === 0)
			this.startCooldown("reload", this.reloading.bind(this));
	}

	/**
	 * Reloads the weapon, resetting the ammo count.
	 */
	reloading(): void {
		this.setData("ammo", 5);
	}
}
