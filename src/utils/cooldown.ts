export class Cooldown {
	private clock: Phaser.Time.Clock;
	private timer?: Phaser.Time.TimerEvent;

	constructor(
		private scene: Phaser.Scene,
		private duration: number,
	) {
		this.clock = this.scene.time;
	}

	start(callback: () => void) {
		if (!this.isReady) return;
		this.timer = this.clock.delayedCall(this.duration, callback);
	}

	get isReady() {
		return this.timer === undefined || this.timer.hasDispatched;
	}

	get timeRemaining() {
		return this.isReady ? 0 : this.timer?.getElapsed();
	}

	get progress() {
		return this.isReady ? 1 : this.timer?.getProgress();
	}
}
