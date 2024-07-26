import { COLLISION } from "@game/configurations/constants";
import { toEntity } from "@game/utils";

export class Bullet extends Phaser.Physics.Matter.Sprite {
	declare body: MatterJS.BodyType;

	private readonly maxTTL = 1000;

	private ttl = 0;
	private speed = 1.5;
	private xSpeed: number;
	private ySpeed: number;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		frame?: string | number,
	) {
		super(scene.matter.world, x, y, texture, frame, {
			label: "bullet",
			isSensor: true,
			// NEED TO BE DEFINE DYNAMICALLY
			collisionFilter: {
				category: COLLISION.PLAYER_PROJECTILE,
				mask: COLLISION.ENEMY,
			},
		});

		this.setOnCollide(this.onCollide.bind(this));
	}

	update(_time: number, _delta: number): void {
		this.setVelocity(this.xSpeed * _delta, this.ySpeed * _delta);
		this.ttl += _delta;
		if (this.ttl > this.maxTTL) this.destroy();
	}

	fire(
		from: Phaser.Types.Math.Vector2Like & { rotation: number },
		to: Phaser.Types.Math.Vector2Like,
	) {
		this.setPosition(from.x, from.y);
		const direction = Math.atan((to.x - this.x) / (to.y - this.y));
		const speed = to.y >= this.y ? this.speed : -this.speed;

		this.xSpeed = speed * Math.sin(direction);
		this.ySpeed = speed * Math.cos(direction);

		this.rotation = from.rotation;
	}

	onCollide({
		bodyA,
		bodyB,
	}: { bodyA: MatterJS.BodyType; bodyB: MatterJS.BodyType }) {
		if (
			bodyA.collisionFilter.category === COLLISION.ENEMY &&
			bodyB.collisionFilter.category === COLLISION.PLAYER_PROJECTILE
		) {
			const entity = toEntity(bodyA.gameObject);
			entity.onDeath();
			this.destroy();
		}
	}
}
