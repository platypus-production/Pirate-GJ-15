import Entity from "../entity";
import { InputManager } from "../input";

export class Player extends Entity {
	private inputManager: InputManager;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super({ scene, x, y, texture: "dummy-cube" });

		this.inputManager = new InputManager(scene);
	}

	protected preUpdate(time: number, delta: number): void {
		super.preUpdate(time, delta);
		this.onMove(this.inputManager.axes);
	}
}

export default Player;
