import { COLLISION } from "@constants";
import { toEntity } from "@utils";
import { SpriteMatter } from "../base/sprite-matter";

export class Bullet extends SpriteMatter {
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

	onCollide({ bodyA, bodyB }: Record<"bodyA" | "bodyB", MatterJS.BodyType>) {
		if (
			bodyA.collisionFilter.category === this.body.collisionFilter.mask &&
			bodyB.collisionFilter.category === this.body.collisionFilter.category
		) {
			const entity = toEntity(bodyA.gameObject);
			entity.onDeath();
			this.destroy();
		}
	}

	setCollistionFilter(payload: COLLISION) {
		this.body.collisionFilter = {
			...this.body.collisionFilter,
			category: payload,
			mask: payload === COLLISION.ENEMY ? COLLISION.PLAYER : COLLISION.ENEMY,
		};
	}
}
