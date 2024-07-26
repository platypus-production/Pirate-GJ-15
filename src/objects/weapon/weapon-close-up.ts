import { Weapon } from "./weapon";

export class WeaponCloseUp extends Weapon {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "weapon-close-up", 0);
		this.setSensor(true);
		this.scene.matter.body.setCentre(
			this.body,
			{
				x: this.width / 2,
				y: 0,
			},
			true,
		);
	}
}
