import type Entity from "./entity";
import { SpriteMatter } from "./sprite-matter";

type EntityFollowerProps<T> = {
	world: Phaser.Physics.Matter.World;
	x: number;
	y: number;
	texture: string | Phaser.Textures.Texture;
	frame?: string | number;
	target?: T;
	bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig;
};

export class EntityFollower<T extends Entity> extends SpriteMatter {
	private _target?: T;
	private isFollowing = false;

	constructor({
		world,
		x,
		y,
		texture,
		frame,
		bodyConfig,
		target,
	}: EntityFollowerProps<T>) {
		super(world, x, y, texture, frame, bodyConfig);
		this._target = target;
	}

	onFollowTarget() {
		if (!this._target) return;
		if (!this.isFollowing) this.setVelocity(0, 0);
		this.setVelocity(
			this._target.getVelocity().x,
			this._target.getVelocity().y,
		);
	}

	attachToTarget<K extends T>(entity: K) {
		this._target = entity;
		this.emit("ON_ATTACH", entity);
	}

	detachToTarget() {
		this._target = undefined;
		this.emit("ON_ATTACH");
	}

	toggleFollowTarget() {
		this.isFollowing = !this.isFollowing;
	}

	get targetRotation() {
		return this._target?.rotation || 0;
	}

	get targetPosition() {
		return {
			x: this._target?.x || 0,
			y: this._target?.y || 0,
		};
	}

	get targetSize() {
		return {
			width: this._target?.width || 0,
			height: this._target?.height || 0,
		};
	}
}
