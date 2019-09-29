export default class ServerClientSync {
	private ping: number = 0;
	private pings: number[] = [];
	private timeDiference: number = 0;
	private timeDiferences: number[] = [];
	private readonly attempts: number = 10;
	private readonly defaultDrawDelay: number = 100;
	private drawDelay: number = this.defaultDrawDelay;
	private wantedSumaNewerSnapshots: number = 6;

	constructor() {}

	getPing(): number {
		return this.ping;
	}

	getTimeDiference(): number {
		return this.timeDiference;
	}

	changeSumaNewer(sumaNewer: number): void {
		if (sumaNewer === 0) this.changeDrawDelay(5);

		
		if (sumaNewer < this.wantedSumaNewerSnapshots - 5 && this.wantedSumaNewerSnapshots - 5 > 0)
			this.changeDrawDelay(1);

		if (sumaNewer > 12) this.changeDrawDelay(-5);
		if (sumaNewer > 11) this.changeDrawDelay(-4);
		if (sumaNewer > 10) this.changeDrawDelay(-3);
		if (sumaNewer > 9) this.changeDrawDelay(-1);
		else if (sumaNewer > 8) this.changeDrawDelay(-0.5);
		else if (sumaNewer > 7) this.changeDrawDelay(-0.2);
		else if (sumaNewer > 6) this.changeDrawDelay(-0.1);
		else if (sumaNewer < 6) this.changeDrawDelay(0.1);
		else if (sumaNewer < 5) this.changeDrawDelay(0.2);
		else if (sumaNewer < 4) this.changeDrawDelay(0.5);
		else if (sumaNewer < 3) this.changeDrawDelay(1);
		else if (sumaNewer < 2) this.changeDrawDelay(2);
		else if (sumaNewer < 1) this.changeDrawDelay(3);
	}

	ready(): boolean {
		return this.pings.length === this.attempts;
	}

	reset(): void {
		this.pings = [];
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
