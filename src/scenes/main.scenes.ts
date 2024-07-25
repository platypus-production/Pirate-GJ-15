import { SCENES } from "@constants";
import { Enemy, Player } from "@objects";

export class Main extends Phaser.Scene {
	player: Player;
	enemy: Enemy;
	constructor() {
		super({
			key: SCENES.MAIN,
		});
	}

	create() {
		this.player = new Player(this, 200, 200);
		this.enemy = new Enemy(this, 500, 500);

		this.enemy.setTarget(this.player);

		this.cameras.main.setZoom(1).startFollow(this.player);
	}

	update(time: number, delta: number): void {
		this.player.update(time, delta);
		this.enemy.update(time, delta);
	}
}

export default Main;
