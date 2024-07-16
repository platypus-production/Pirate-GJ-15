import { DEFAULT_HEIGHT, DEFAULT_WIDTH, SCENES } from "@constants";

export class Main extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.MAIN });
	}

	create() {
		this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2, "THIS IS A GAME!", {
			color: "white",
			align: "center",
		});
	}
}

export default Main;
