export default class ServerClientSync {
	private ping: number = 0;
	private pings: number[] = [];
	private timeDiference: number = 0;
	private timeDiferences: number[] = [];
	private readonly attempts: number = 3;
	private readonly defaultDrawDelay: number = 100;
	private drawDelay: number = this.defaultDrawDelay;

	constructor() {}

	getPing(): number {
		return this.ping;
	}

	getTimeDiference(): number {
		return this.timeDiference;
	}

	ready(): boolean {
		//return this.ping != null && this.timeDiference != null;
		return this.pings.length === this.attempts;
	}

	reset(): void {
		//this.ping = null;
		this.pings = [];
		//this.timeDiference = null;
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
		//if (this.drawDelay < this.minDrawDelay) this.drawDelay = this.minDrawDelay;
	}

	getDrawDelay(): number {
		return this.drawDelay;
	}

	getServerTime(): number {
		let serverTime = Date.now();
		if (this.ready()) {
			serverTime += this.getTimeDiference();
		}
		return serverTime;
	}
}
