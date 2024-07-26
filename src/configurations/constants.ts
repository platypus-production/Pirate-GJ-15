export const DEFAULT_PHYSICS: "matter" | "arcade" = "matter";
export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;

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

export enum COLLISION {
	NONE = 0,
	PLAYER = 1,
	ENEMY = 2,
	ENEMY_PROJECTILE = 3,
	PLAYER_PROJECTILE = 4,
}
