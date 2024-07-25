import { SCENES } from "@game/configurations/constants";

export class Preload extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.PRELOAD });
	}

	preload() {
		this.add
			.text(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2 - 40,
				"Loading...",
				{
					font: "20px monospace",
					color: "#ffffff",
				},
			)
			.setOrigin(0.5, 0.5);

		const progress_bar = this.add.graphics();
		const progress_box = this.add.graphics();

		progress_bar.fillStyle(0x222222, 0.8);
		progress_box.fillRect(
			this.cameras.main.width / 2 - 160,
			this.cameras.main.height / 2,
			320,
			50,
		);
		const percentage = this.add
			.text(
				this.cameras.main.width / 2,
				this.cameras.main.height / 2 + 25,
				"0%",
				{
					font: "20px monospace",
					color: "#ffffff",
				},
			)
			.setOrigin(0.5, 0.5);

		this.load.on("progress", (value: number) => {
			percentage.setText(`${value * 100}%`);
			progress_bar.clear();
			progress_bar.fillStyle(0xdedede, 1);
			progress_bar.fillRect(
				this.cameras.main.width / 2 - 160,
				this.cameras.main.height / 2,
				300 * value,
				20,
			);
		});

		this.createDummyTexture(0xff0000, "dummy-cube", 64, 32);
		this.createDummyTexture(0xff00ff, "dummy-enemy-cube", 64, 32);
		this.createDummyTexture(0xfff000, "dummy-item-a", 32, 32);
		this.createDummyTexture(0xff00ff, "dummy-item-b", 32, 32);
		this.createDummyTexture(0x00ff00, "dummy-item-c", 32, 32);
		this.createDummyTexture(0x00ff00, "reticle", 8, 8);

		this.load.on("complete", () => this.scene.start(SCENES.MAIN));
	}

	createDummyTexture(color: number, name: string, width = 64, height?: number) {
		const dummy_cube = this.add.renderTexture(0, 0, width, height || width);
		const dummy_cube_graphic = this.add
			.graphics()
			.fillStyle(color)
			.fillRect(0, 0, 64, 64);
		dummy_cube.draw(dummy_cube_graphic);
		dummy_cube.saveTexture(name);
	}
}

export default Preload;
