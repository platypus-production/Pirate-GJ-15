import type { FunctionWithUnknowArgs } from "@types";

type EntityProps = {
	scene: Phaser.Scene;
	x: number;
	y: number;
	texture: string | Phaser.Textures.Texture;
	frame?: string | number;
	stats?: { speed: number };
};

export const EntityEventEmitter = new Phaser.Events.EventEmitter();
export class Entity extends Phaser.GameObjects.Sprite {
	declare body: Phaser.Physics.Arcade.Body;
	private stats: NonNullable<EntityProps["stats"]>;

	constructor({ scene, x, y, texture, frame, stats }: EntityProps) {
		super(scene, x, y, texture, frame);

		this.stats = {
			speed: 600,
			...stats,
		};

		this.scene.add.existing(this);
		this.scene.physics.add.existing(this);

		this.body.setBounce(0.2).setMaxVelocity(this.stats.speed);
		EntityEventEmitter.on("ON_DEATH", this.onDeath, this);
	}

	onMove(axes: Record<"x" | "y", -1 | 0 | 1>) {
		this.body.setVelocity(axes.x * this.stats.speed, axes.y * this.stats.speed);
		this.body.velocity.normalize().scale(this.stats.speed);
	}

	onDeath(callback?: FunctionWithUnknowArgs) {
		if (callback) {
			callback();
		}
		this.destroy();
	}
}

export default Entity;
