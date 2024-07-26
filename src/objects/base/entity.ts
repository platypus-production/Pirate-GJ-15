import type { FunctionWithUnknowArgs } from "@types";

type EntityProps = {
	scene: Phaser.Scene;
	x: number;
	y: number;
	texture: string | Phaser.Textures.Texture;
	frame?: string | number;
	stats?: { speed: number };
};

export class Entity extends Phaser.Physics.Matter.Sprite {
	declare body: MatterJS.BodyType;
	private stats: NonNullable<EntityProps["stats"]>;
	private alive = true;
	constructor(
		world: Phaser.Physics.Matter.World,
		x: number,
		y: number,
		texture: string | Phaser.Textures.Texture,
		frame?: string | number,
		bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig,
		stats?: { speed: number },
	) {
		super(world, x, y, texture, frame, bodyConfig);
		this.stats = {
			...stats,
			speed: 10,
		};
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
		if (this.alive) this.alive = false;
		if (callback) {
			callback();
		}
		this.destroy();
	}

	get isAlive() {
		return this.alive;
	}
}

export default Entity;
