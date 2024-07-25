import Entity from "../entity";
import { InputManager } from "../input";
import PlayerReticle from "./player-reticle";

export class Player extends Entity {
	private inputManager: InputManager;
	private reticle: PlayerReticle;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene.matter.world, x, y, "dummy-cube");

		this.inputManager = new InputManager(scene);

		this.reticle = new PlayerReticle(scene, x, y + 50);
		this.reticle.attach(this);
	}

	update(_time: number, _delta: number): void {
		this.onMove(this.inputManager.axes);
		this.reticle.update(_time, _delta);
		this.startFollowReticle();
	}

	private startFollowReticle() {
		const angle = Phaser.Math.Angle.Between(
			this.x,
			this.y,
			this.reticle.x,
			this.reticle.y,
		);

		this.setRotation(angle - 1.5);
	}
}

export default Player;
