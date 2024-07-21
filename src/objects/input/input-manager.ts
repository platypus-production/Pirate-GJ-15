export type InputManagerEventName =
	| "UPDATE_KEYS_MAPPING"
	| "RESET_KEYS_MAPPING";
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

type KeysMappingProps<T> = Record<KeysMappingName, T>;

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

export class InputManager {
	private keys: KeysMappingProps<Phaser.Input.Keyboard.Key>;
	private keyboard: Phaser.Input.Keyboard.KeyboardPlugin;
	private events = new Phaser.Events.EventEmitter();

	constructor(scene: Phaser.Scene) {
		this.keyboard = scene.input.keyboard!;
		this.keys = this.keyboard.addKeys(
			DEFAULT_KEYS_MAPPING,
		) as KeysMappingProps<Phaser.Input.Keyboard.Key>;

		this.on("UPDATE_KEYS_MAPPING", this.onKeysMappingUpdate, this);
		this.on("RESET_KEYS_MAPPING", this.onKeysMappingResetToDefault, this);
	}

	private onKeysMappingUpdate(keys: Partial<KeysMappingProps<number>>) {
		this.keys = this.keyboard.addKeys({
			...this.keys,
			...keys,
		}) as KeysMappingProps<Phaser.Input.Keyboard.Key>;
	}

	private onKeysMappingResetToDefault() {
		this.keys = this.keyboard.addKeys(
			DEFAULT_KEYS_MAPPING,
		) as KeysMappingProps<Phaser.Input.Keyboard.Key>;
	}

	emit<T>(eventName: InputManagerEventName, ...data: Array<T>) {
		return this.events.emit(eventName, data);
	}

	on<T, K>(eventName: InputManagerEventName, callback: T, context?: K) {
		return this.events.emit(eventName, callback, context);
	}

	justDown(key: Phaser.Input.Keyboard.Key): boolean {
		return Phaser.Input.Keyboard.JustDown(key);
	}

	justUp(key: Phaser.Input.Keyboard.Key): boolean {
		return Phaser.Input.Keyboard.JustUp(key);
	}

	checkDown(key: Phaser.Input.Keyboard.Key, duration = 0) {
		return this.keyboard.checkDown(key, duration);
	}

	upDuration(key: Phaser.Input.Keyboard.Key, duration = 0) {
		return Phaser.Input.Keyboard.UpDuration(key, duration);
	}

	downDuration(key: Phaser.Input.Keyboard.Key, duration = 0) {
		return Phaser.Input.Keyboard.DownDuration(key, duration);
	}

	get axes(): Record<"x" | "y", 1 | 0 | -1> {
		return {
			x: this.axe_x,
			y: this.axe_y,
		};
	}

	get axe_x(): 1 | 0 | -1 {
		return this.keys.right.isDown ? 1 : this.keys.left.isDown ? -1 : 0;
	}

	get axe_y(): 1 | 0 | -1 {
		return this.keys.up.isDown ? 1 : this.keys.down.isDown ? -1 : 0;
	}

	get attack_axes(): Record<"x" | "y", 1 | 0 | -1> {
		return {
			x: this.attack_axe_x,
			y: this.attack_axe_y,
		};
	}

	get attack_axe_x(): 1 | 0 | -1 {
		return this.keys.attack_right.isDown ? 1 : this.keys.attack_left ? -1 : 0;
	}

	get attack_axe_y(): 1 | 0 | -1 {
		return this.keys.attack_up.isDown ? 1 : this.keys.attack_down ? -1 : 0;
	}

	get pause(): boolean {
		return this.justDown(this.keys.pause);
	}

	get itemLocationAJustDown(): boolean {
		return this.justDown(this.keys.itemLocationA);
	}

	get itemLocationADown(): boolean {
		return this.downDuration(this.keys.itemLocationA, 1000);
	}

	get itemLocationBJustDown(): boolean {
		return this.justDown(this.keys.itemLocationB);
	}

	get itemLocationBDown(): boolean {
		return this.downDuration(this.keys.itemLocationB, 1000);
	}

	get itemLocationCJustDown(): boolean {
		return this.justDown(this.keys.itemLocationC);
	}

	get itemLocationCDown(): boolean {
		return this.downDuration(this.keys.itemLocationC, 1000);
	}

	get itemLocationDJustDown(): boolean {
		return this.justDown(this.keys.itemLocationD);
	}

	get itemLocationDDown(): boolean {
		return this.downDuration(this.keys.itemLocationD, 1000);
	}
}
