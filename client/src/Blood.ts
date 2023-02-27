export default class Blood {
	readonly size: number = 12;
	private x: number;
	private y: number;
	private timer: number = 0;
	readonly timerMax: number = 60;

	constructor() {
		this.x = Math.round(Math.random() * 30) * -1;
		this.y = Math.round(Math.random() * 30);
	}

	shift(): void {
		this.x += 20;
		this.y -= 20;
		this.timer++;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getTimer(): number {
		return this.timer;
	}
}
