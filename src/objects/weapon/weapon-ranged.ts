import { Weapon, WeaponEventEmitter } from "./weapon";
import { Bullet } from "./weapon-bullet";

export class WeaponRanged extends Weapon {
	private mag: Phaser.GameObjects.Group;

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

	handleFire() {
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

	reloading() {
		this.setData("ammo", 5);
	}
}
