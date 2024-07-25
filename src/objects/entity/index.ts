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

export class Entity extends Phaser.Physics.Matter.Sprite {
	declare body: MatterJS.BodyType;
	private stats: NonNullable<EntityProps["stats"]>;

	constructor(
		world: Phaser.Physics.Matter.World,
		x: number,
		y: number,
		texture: string | Phaser.Textures.Texture,
		frame?: string | number,
		stats?: { speed: number },
	) {
		super(world, x, y, texture, frame, {});
		this.stats = {
			...stats,
			speed: 10,
		};
		EntityEventEmitter.on("ON_DEATH", this.onDeath, this);
	}

	onMove(axes: Record<"x" | "y", -1 | 0 | 1>) {
		const normalize = new Phaser.Math.Vector2(
			axes.x * this.stats.speed,
			axes.y * this.stats.speed,
		)
			.normalize()
			.scale(this.stats.speed);

		this.setVelocity(normalize.x, normalize.y);
	}

	onDeath(callback?: FunctionWithUnknowArgs) {
		if (callback) {
			callback();
		}
		this.destroy();
	}
}

export default Entity;
