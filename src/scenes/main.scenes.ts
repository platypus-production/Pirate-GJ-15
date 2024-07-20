import { DEFAULT_HEIGHT, DEFAULT_WIDTH, SCENES } from "@constants";

export class Main extends Phaser.Scene {
	constructor() {
		super({ key: SCENES.MAIN });
	}

	create() {
		// this.add
		// 	.text(
		// 		DEFAULT_WIDTH / 2,
		// 		DEFAULT_HEIGHT / 2,
		// 		this.i18n.t("common.hello_world"),
		// 		{
		// 			color: "white",
		// 			align: "center",
		// 		},
		// 	)
		// 	.setOrigin(0.5);
		const buttonContainer = this.add.container(
			DEFAULT_WIDTH / 2 - 40,
			DEFAULT_HEIGHT / 2 + 64,
		);
		for (const lang of this.i18n.supportedLngs) {
			const text = this.add
				.text(0 + buttonContainer.length * 32, 0, lang, {
					color: "white",
					align: "center",
				})
				.setOrigin(0.5)
				.setInteractive()
				.on("pointerdown", () => this.i18n.changeLanguage(lang));
			buttonContainer.add(text);
		}

		const text = this.add
			.i18Text({
				x: DEFAULT_WIDTH / 2,
				y: DEFAULT_HEIGHT / 2,
				text: "common.hello",
				interpolation: { name: "John Doe" },
				style: {
					color: "white",
					align: "center",
				},
			})
			.setOrigin(0.5);
	}
}

export default Main;
