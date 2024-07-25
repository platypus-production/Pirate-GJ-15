import "phaser";
import { config } from "@config";

window.addEventListener("load", () => {
	const game = new Phaser.Game(config);

	game.canvas.addEventListener("mousedown", () => {
		game.input.mouse?.requestPointerLock();
	});
});
