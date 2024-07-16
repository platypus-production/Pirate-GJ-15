export const DEFAULT_PHYSICS: "matter" | "arcade" = "arcade";
export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;

export const DEFAULT_INPUT_KEYS = {
	left: Phaser.Input.Keyboard.KeyCodes.LEFT,
	right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
	up: Phaser.Input.Keyboard.KeyCodes.UP,
	down: Phaser.Input.Keyboard.KeyCodes.DOWN,
	pause: Phaser.Input.Keyboard.KeyCodes.P,
};

export enum SCENES {
	PRELOAD = "preload-scene",
	MENU = "menu-scene",
	MAIN = "main-scene",
	GAME_OVER = "game-over-scene",
}

export enum OVERLAY {
	HUD = "hud-overlay",
	MAP = "map-overlay",
}
