import { Physics } from "phaser";
import type Entity from "./entity";
type EntityWithTargetProps<T> = {
	world: Phaser.Physics.Matter.World;
	x: number;
	y: number;
	texture: string;
	frame?: string | number;
	target?: T;
	bodyConfig?: Phaser.Types.Physics.Matter.MatterBodyConfig;
};
export class EntityWithTarget<T extends Entity> extends Phaser.Physics.Matter
	.Sprite {
	declare body: MatterJS.BodyType;

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
	}: EntityWithTargetProps<T>) {
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
	}

	detachToTarget() {
		this._target = undefined;
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

	setBodyOrigin(originX: number, originY: number): this {
		if (this.body) {
			// Calculer le décalage par rapport à l'origine actuelle
			const offsetX = (originX - this.originX) * this.width;
			const offsetY = (originY - this.originY) * this.height;

			// Mettre à jour la position du body
			this.scene.matter.body.setPosition(
				this.body as MatterJS.BodyType,
				{
					x: this.body.position.x + offsetX,
					y: this.body.position.y + offsetY,
				},
				true,
			);

			// Mettre à jour l'origine du sprite
			this.setOrigin(originX, originY);
		}
		return this;
	}
}
