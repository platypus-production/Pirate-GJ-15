import { COLLISION } from "@game/configurations/constants";
import { Entity } from "../base";
import { InputManager } from "../input";
import type { Weapon } from "../weapon";
import { WeaponCloseUp } from "../weapon/weapon-close-up";
import PlayerReticle from "./player-reticle";

export class Player extends Entity {
	private inputManager: InputManager;
	private reticle: PlayerReticle;
	private weapon: Weapon | null = null;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene.matter.world, x, y, "dummy-cube", 0, {
			label: "player",
			collisionFilter: {
				group: COLLISION.PLAYER,
				mask: COLLISION.ENEMY | COLLISION.ENEMY_PROJECTILE,
			},
		});

		this.inputManager = new InputManager(scene);

		this.reticle = new PlayerReticle(scene, x, y + 50);
		this.reticle.attach(this);

		this.weapon = new WeaponCloseUp(scene, x, y);
		this.weapon.attachToTarget(this);
	}

	update(_time: number, _delta: number): void {
		this.onMove(this.inputManager.axes);
		this.reticle.update(_time, _delta);
		this.startFollowReticle();

		if (this.weapon) this.weapon.update(_time, _delta);
	}

	private startFollowReticle() {
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
