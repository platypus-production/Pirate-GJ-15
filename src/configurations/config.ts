import { DEFAULT_HEIGHT, DEFAULT_PHYSICS, DEFAULT_WIDTH } from "@constants";
import { phaserI18n } from "@plugins";
import scenes from "@scenes";
import resources from "../assets/i18n";

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: "#1E1E1E",
	render: {
		pixelArt: true,
	},
	scene: scenes,
	plugins: {
		global: [phaserI18n({ resources })],
	},
	scale: {
		parent: "phaser-game",
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: DEFAULT_WIDTH,
		height: DEFAULT_HEIGHT,
	},
	physics: {
		default: DEFAULT_PHYSICS,
		[DEFAULT_PHYSICS]: {
			debug: process.env.NODE_ENV === "development",
		},
	},
};

export default config;
