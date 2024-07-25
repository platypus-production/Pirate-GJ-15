import type Entity from "../entity";

export class PlayerReticle extends Phaser.Physics.Matter.Sprite {
	private _target: Entity;
	private _pointer: Phaser.Input.Pointer;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene.matter.world, x, y, "reticle", 0, {
			isSensor: true,
		});

		this._pointer = this.scene.input.activePointer;
	}

	update(_time: number, _delta: number): void {
		this.setVelocity(
			this._target.getVelocity().x,
			this._target.getVelocity().y,
		);
		this.startFollowPointer();
		this.constrain();
	}

	attach(target: Entity) {
		this._target = target;
	}

	private startFollowPointer() {
		if (this._pointer.locked) {
			this.x += this._pointer.movementX;
			this.y += this._pointer.movementY;

			const distX = this.x - this._target.x;
			const distY = this.y - this._target.y;

			if (distX > 250) {
				this.x = this._target.x + 250;
			}
			if (distX < -250) {
				this.x = this._target.x - 250;
			}

			if (distY > 150) {
				this.y = this._target.y + 150;
			}
			if (distY < -150) {
				this.y = this._target.y - 150;
			}
		}
	}

	private constrain() {
		const distX = this.x - this._target.x;
		const distY = this.y - this._target.y;

		if (distX > 800) {
			this.x = this._target.x + 800;
		} else if (distX < -800) {
			this.x = this._target.x - 800;
		}

		if (distY > 600) {
			this.y = this._target.y + 600;
		} else if (distY < -600) {
			this.y = this._target.y - 600;
		}

		const distBetween = Phaser.Math.Distance.Between(
			this._target.x,
			this._target.y,
			this.x,
			this.y,
		);
		if (distBetween > 275) {
			const scale = distBetween / 275;

			this.x = this._target.x + (this.x - this._target.x) / scale;
			this.y = this._target.y + (this.y - this._target.y) / scale;
		}
	}
}

export default PlayerReticle;
