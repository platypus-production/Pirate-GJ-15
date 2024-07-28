/**
 * @file InputManager and related types for managing game input.
 */

import type { FunctionWithUnknowArgs } from "@types";

/**
 * Possible event names for the InputManager.
 */
export type InputManagerEventName =
	| "UPDATE_KEYS_MAPPING"
	| "RESET_KEYS_MAPPING";

/**
 * Names of the keys that can be mapped.
 */
export type KeysMappingName =
	| "left"
	| "right"
	| "up"
	| "down"
	| "attack_up"
	| "attack_down"
	| "attack_left"
	| "attack_right"
	| "itemLocationA"
	| "itemLocationB"
	| "itemLocationC"
	| "itemLocationD"
	| "pause";

/**
 * Type for mapping key names to their respective values.
 */
type KeysMappingProps<T> = Record<KeysMappingName, T>;

/**
 * Default key mapping configuration using Phaser.Input.Keyboard.KeyCodes.
 */
const DEFAULT_KEYS_MAPPING: KeysMappingProps<number> = {
	left: Phaser.Input.Keyboard.KeyCodes.LEFT,
	right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
	up: Phaser.Input.Keyboard.KeyCodes.UP,
	down: Phaser.Input.Keyboard.KeyCodes.DOWN,
	attack_up: Phaser.Input.Keyboard.KeyCodes.Z,
	attack_down: Phaser.Input.Keyboard.KeyCodes.S,
	attack_left: Phaser.Input.Keyboard.KeyCodes.Q,
	attack_right: Phaser.Input.Keyboard.KeyCodes.D,
	itemLocationA: Phaser.Input.Keyboard.KeyCodes.SPACE,
	itemLocationB: Phaser.Input.Keyboard.KeyCodes.A,
	itemLocationC: Phaser.Input.Keyboard.KeyCodes.E,
	itemLocationD: Phaser.Input.Keyboard.KeyCodes.F,
	pause: Phaser.Input.Keyboard.KeyCodes.ESC,
};

/**
 * Manages input for the game, including key mappings and input states.
 * @remarks Consider converting this class into a Singleton. We'll only need one class input for the whole game.
 */
export class InputManager {
	/** Mapped keys. */
	private keys: KeysMappingProps<Phaser.Input.Keyboard.Key>;

	/** Phaser's keyboard plugin. */
	private keyboard: Phaser.Input.Keyboard.KeyboardPlugin;

	/** Event emitter for input-related events. */
	private events = new Phaser.Events.EventEmitter();

	/**
	 * Creates a new InputManager instance.
	 * @param scene - The Phaser scene this input manager belongs to.
	 */
	constructor(scene: Phaser.Scene) {
		this.keyboard = scene.input.keyboard!;
		this.keys = this.keyboard.addKeys(
			DEFAULT_KEYS_MAPPING,
		) as KeysMappingProps<Phaser.Input.Keyboard.Key>;

		this.on("UPDATE_KEYS_MAPPING", this.onKeysMappingUpdate, this);
		this.on("RESET_KEYS_MAPPING", this.onKeysMappingResetToDefault, this);
	}

	/**
	 * Updates the key mappings.
	 * @param keys - Partial key mapping to update.
	 */
	private onKeysMappingUpdate(keys: Partial<KeysMappingProps<number>>): void {
		this.keys = this.keyboard.addKeys({
			...this.keys,
			...keys,
		}) as KeysMappingProps<Phaser.Input.Keyboard.Key>;
	}

	/**
	 * Resets the key mappings to default.
	 */
	private onKeysMappingResetToDefault(): void {
		this.keys = this.keyboard.addKeys(
			DEFAULT_KEYS_MAPPING,
		) as KeysMappingProps<Phaser.Input.Keyboard.Key>;
	}

	/**
	 * Emits an input-related event.
	 * @param eventName - Name of the event to emit.
	 * @param data - Data to pass with the event.
	 * @returns True if the event had listeners, false otherwise.
	 */
	emit<T>(eventName: InputManagerEventName, ...data: Array<T>): boolean {
		return this.events.emit(eventName, data);
	}

	/**
	 * Adds a listener for an input-related event.
	 * @param eventName - Name of the event to listen for.
	 * @param callback - Function to call when the event is emitted.
	 * @param context - Context in which to call the function.
	 * @returns This InputManager instance.
	 */
	on<T extends FunctionWithUnknowArgs, K>(
		eventName: InputManagerEventName,
		callback: T,
		context?: K,
	): this {
		this.events.on(eventName, callback, context);
		return this;
	}

	/**
	 * Checks if a key was just pressed down.
	 * @param key - The key to check.
	 * @returns True if the key was just pressed down, false otherwise.
	 */
	justDown(key: Phaser.Input.Keyboard.Key): boolean {
		return Phaser.Input.Keyboard.JustDown(key);
	}

	/**
	 * Checks if a key was just released.
	 * @param key - The key to check.
	 * @returns True if the key was just released, false otherwise.
	 */
	justUp(key: Phaser.Input.Keyboard.Key): boolean {
		return Phaser.Input.Keyboard.JustUp(key);
	}

	/**
	 * Checks if a key is currently held down.
	 * @param key - The key to check.
	 * @param duration - The duration to check for (in milliseconds).
	 * @returns True if the key is held down for the specified duration, false otherwise.
	 */
	checkDown(key: Phaser.Input.Keyboard.Key, duration = 0): boolean {
		return this.keyboard.checkDown(key, duration);
	}

	/**
	 * Checks how long a key has been up.
	 * @param key - The key to check.
	 * @param duration - The duration to check against (in milliseconds).
	 * @returns True if the key has been up for the specified duration, false otherwise.
	 */
	upDuration(key: Phaser.Input.Keyboard.Key, duration = 0): boolean {
		return Phaser.Input.Keyboard.UpDuration(key, duration);
	}

	/**
	 * Checks how long a key has been down.
	 * @param key - The key to check.
	 * @param duration - The duration to check against (in milliseconds).
	 * @returns True if the key has been down for the specified duration, false otherwise.
	 */
	downDuration(key: Phaser.Input.Keyboard.Key, duration = 0): boolean {
		return Phaser.Input.Keyboard.DownDuration(key, duration);
	}

	/**
	 * Gets the current axes values based on key presses.
	 * @returns An object with x and y axes values.
	 */
	get axes(): Record<"x" | "y", 1 | 0 | -1> {
		return {
			x: this.axe_x,
			y: this.axe_y,
		};
	}

	/**
	 * Gets the current x-axis value based on key presses.
	 * @returns 1 for right, -1 for left, 0 for neutral.
	 */
	get axe_x(): 1 | 0 | -1 {
		return this.keys.attack_right.isDown
			? 1
			: this.keys.attack_left.isDown
				? -1
				: 0;
	}

	/**
	 * Gets the current y-axis value based on key presses.
	 * @returns -1 for up, 1 for down, 0 for neutral.
	 */
	get axe_y(): 1 | 0 | -1 {
		return this.keys.attack_up.isDown
			? -1
			: this.keys.attack_down.isDown
				? 1
				: 0;
	}

	/**
	 * Gets the current attack axes values based on key presses.
	 * @returns An object with x and y attack axes values.
	 */
	get attack_axes(): Record<"x" | "y", 1 | 0 | -1> {
		return {
			x: this.attack_axe_x,
			y: this.attack_axe_y,
		};
	}

	/**
	 * Gets the current x-axis attack value based on key presses.
	 * @returns 1 for right attack, -1 for left attack, 0 for no attack.
	 */
	get attack_axe_x(): 1 | 0 | -1 {
		return this.keys.attack_right.isDown ? 1 : this.keys.attack_left ? -1 : 0;
	}

	/**
	 * Gets the current y-axis attack value based on key presses.
	 * @returns 1 for up attack, -1 for down attack, 0 for no attack.
	 */
	get attack_axe_y(): 1 | 0 | -1 {
		return this.keys.attack_up.isDown ? 1 : this.keys.attack_down ? -1 : 0;
	}

	/**
	 * Checks if the pause key was just pressed.
	 * @returns True if the pause key was just pressed, false otherwise.
	 */
	get pause(): boolean {
		return this.justDown(this.keys.pause);
	}

	/**
	 * Checks if the item location A key was just pressed.
	 * @returns True if the item location A key was just pressed, false otherwise.
	 */
	get itemLocationAJustDown(): boolean {
		return this.justDown(this.keys.itemLocationA);
	}

	/**
	 * Checks if the item location A key has been held down for 1 second.
	 * @returns True if the item location A key has been held down for 1 second, false otherwise.
	 */
	get itemLocationADown(): boolean {
		return this.downDuration(this.keys.itemLocationA, 1000);
	}

	/**
	 * Checks if the item location B key was just pressed.
	 * @returns True if the item location B key was just pressed, false otherwise.
	 */
	get itemLocationBJustDown(): boolean {
		return this.justDown(this.keys.itemLocationB);
	}

	/**
	 * Checks if the item location B key has been held down for 1 second.
	 * @returns True if the item location B key has been held down for 1 second, false otherwise.
	 */
	get itemLocationBDown(): boolean {
		return this.downDuration(this.keys.itemLocationB, 1000);
	}

	/**
	 * Checks if the item location C key was just pressed.
	 * @returns True if the item location C key was just pressed, false otherwise.
	 */
	get itemLocationCJustDown(): boolean {
		return this.justDown(this.keys.itemLocationC);
	}

	/**
	 * Checks if the item location C key has been held down for 1 second.
	 * @returns True if the item location C key has been held down for 1 second, false otherwise.
	 */
	get itemLocationCDown(): boolean {
		return this.downDuration(this.keys.itemLocationC, 1000);
	}

	/**
	 * Checks if the item location D key was just pressed.
	 * @returns True if the item location D key was just pressed, false otherwise.
	 */
	get itemLocationDJustDown(): boolean {
		return this.justDown(this.keys.itemLocationD);
	}

	/**
	 * Checks if the item location D key has been held down for 1 second.
	 * @returns True if the item location D key has been held down for 1 second, false otherwise.
	 */
	get itemLocationDDown(): boolean {
		return this.downDuration(this.keys.itemLocationD, 1000);
	}
}
