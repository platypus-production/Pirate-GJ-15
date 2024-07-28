import { COLLISION } from "@constants";
import { Cooldown, isEnemy, isPlayer } from "@utils";
import { type Entity, EntityFollower } from "../base";
import type { Enemy } from "../enemy";
import type { Player } from "../player";

export const WeaponEventEmitter = new Phaser.Events.EventEmitter();

// @TODO: Create cache File for weapon statistique
export class Weapon extends EntityFollower<Entity> {
	private offsetDistance: number;
	private offsetAngle: number;
	private cooldowns: Map<string, Cooldown>;

	public targetCategory: COLLISION;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig,
		fireCooldown = 200,
	) {
		super({ world: scene.matter.world, x, y, texture, bodyConfig });

		this.offsetDistance = 30;
		this.offsetAngle = Math.PI / 2;

		this.cooldowns = new Map<string, Cooldown>();

		this.cooldowns.set("fire", new Cooldown(scene, fireCooldown));

		this.on("ON_ATTACH", this.defineTargetCategory, this);

		scene.input.on("pointerdown", this.onFire, this);
	}

	update(_time: number, _delta: number): void {
		this.onFollowTarget();
		this.updatePosition();
	}

	private updatePosition() {
		const totalAngle = this.targetRotation + this.offsetAngle;

		this.x = this.targetPosition.x + Math.cos(totalAngle) * this.offsetDistance;
		this.y = this.targetPosition.y + Math.sin(totalAngle) * this.offsetDistance;

		this.setRotation(this.targetRotation);
	}

	private onFire() {
		this.startCooldown("fire", () => WeaponEventEmitter.emit("ON_FIRE"));
	}

	private defineTargetCategory(entity: Player | Enemy | Entity) {
		if (isEnemy(entity)) {
			this.targetCategory = COLLISION.PLAYER;
			return;
		}
		if (isPlayer(entity)) {
			this.targetCategory = COLLISION.PLAYER;
			return;
		}

		this.targetCategory = COLLISION.NONE;
	}

	addCooldown(key: string, duration: number) {
		this.cooldowns.set(key, new Cooldown(this.scene, duration));
	}

	getCooldown(key: string) {
		if (!this.cooldowns.has(key))
			throw new Error(`Cooldown ${key} doesn't exist.`);
		return this.cooldowns.get(key)!;
	}

	startCooldown(key: string, callback: () => void) {
		const cooldown = this.getCooldown(key);
		if (!cooldown.isReady) return;
		cooldown.start(callback);
	}

	getCooldownStatus(key: string) {
		return this.cooldowns.get(key)!.isReady;
	}
}
