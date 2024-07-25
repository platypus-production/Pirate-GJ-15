import { Entity } from "../entity";

export class Enemy extends Entity {
	private _target: Entity;
	private readonly CHASE_DISTANCE = 300;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene.matter.world, x, y, "dummy-enemy-cube");
	}

	update(_time: number, _delta: number) {
		if (this.shouldChase()) {
			this.startFollowTarget();
		} else {
			this.stopMoving();
		}
	}

	setTarget(payload: Entity) {
		this._target = payload;
	}

	private startRotateToTarget(tx: number, ty: number) {
		return Phaser.Math.Angle.Between(this.x, this.y, tx, ty);
	}

	private startFollowTarget() {
		if (!this._target) return;
		const { x: tx, y: ty } = this._target;
		const angle = this.startRotateToTarget(tx, ty);
		const distance = this.distanceToTarget(tx, ty);

		if (!this.isColliding()) {
			const speed = this.calculateSpeed(distance);
			const vector = new Phaser.Math.Vector2(
				Math.cos(angle) * speed,
				Math.sin(angle) * speed,
			);
			this.setRotation(angle + 80);
			this.setVelocity(vector.x, vector.y);
		} else {
			this.stopMoving();
		}
	}

	private stopMoving() {
		if (!this._target) return;
		this.startRotateToTarget(this._target.x, this._target.y);
		this.setVelocity(0, 0);
	}

	private distanceToTarget(tx: number, ty: number) {
		return Phaser.Math.Distance.Between(this.x, this.y, tx, ty);
	}

	private shouldChase() {
		if (!this._target) return false;
		const distance = this.distanceToTarget(this._target.x, this._target.y);
		return distance <= this.CHASE_DISTANCE && !this.isColliding();
	}

	private calculateSpeed(distance: number) {
		return Math.min(10, distance / 25);
	}

	private isColliding() {
		if (!this._target) return false;

		const enemyBounds = this.getBounds();
		const targetBounds = this._target.getBounds();

		const centerDistance = Phaser.Math.Distance.Between(
			enemyBounds.centerX,
			enemyBounds.centerY,
			targetBounds.centerX,
			targetBounds.centerY,
		);

		const sumOfRadii =
			Math.max(enemyBounds.width, enemyBounds.height) / 2 +
			Math.max(targetBounds.width, targetBounds.height) / 2;

		return centerDistance <= sumOfRadii;
	}
}
