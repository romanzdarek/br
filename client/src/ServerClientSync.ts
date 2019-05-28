export default class ServerClientSync {
	private ping: number | null = null;
	private pings: number[] = [];
	private timeDiference: number | null = null;
	private timeDiferences: number[] = [];
	private readonly attempts: number = 10;
	private readonly defaultDrawDelay: number = 50;
	private drawDelay: number = this.defaultDrawDelay;

	constructor() {}

	getPing(): number {
		return this.ping;
	}

	getTimeDiference(): number {
		return this.timeDiference;
	}

	ready(): boolean {
		return this.ping != null && this.timeDiference != null;
	}

	reset(): void {
		this.ping = null;
		this.pings = [];
		this.timeDiference = null;
		this.timeDiferences = [];
	}

	addData(ping: number, timeDiference: number): void {
		if (!this.ready()) {
			this.pings.push(ping);
			this.timeDiferences.push(timeDiference);
		}
		//count average
		if (this.pings.length === this.attempts) {
			let pingsSuma = 0;
			for (const ping of this.pings) {
				pingsSuma += ping;
			}
			this.ping = pingsSuma / this.attempts;
			let timeDiferenceSuma = 0;
			for (const timeDiference of this.timeDiferences) {
				timeDiferenceSuma += timeDiference;
			}
			this.timeDiference = timeDiferenceSuma / this.attempts;
		}
	}

	changeDrawDelay(change: number): void {
		this.drawDelay += change;
		if (this.drawDelay < 0) this.drawDelay = 0;
	}

	getDrawDelay(): number {
		return this.drawDelay;
	}
}
