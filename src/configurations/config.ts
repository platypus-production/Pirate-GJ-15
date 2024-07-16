import { DEFAULT_HEIGHT, DEFAULT_PHYSICS, DEFAULT_WIDTH } from "@constants";
import scenes from "@scenes";

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: "#1E1E1E",
	fps: {
		smoothStep: false,
	},
	render: {
		pixelArt: true,
	},
	scene: scenes,
	plugins: {},
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
			overlapBias: 8,
		},
	},
};

export default config;
