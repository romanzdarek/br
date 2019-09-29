export default class ServerClientSync {
	private ping: number = 0;
	private pings: number[] = [];
	private timeDiference: number = 0;
	private timeDiferences: number[] = [];
	private readonly pingAttempts: number = 5;
	private readonly defaultDrawDelay: number = 70;
	private drawDelay: number = this.defaultDrawDelay;
	private minWantedSumaNewerSnapshots: number = 3;
	private defaultWantedNewerSnapshots: number = 5;
	private wantedSumaNewerSnapshots: number = this.defaultWantedNewerSnapshots;
	private maxWantedSumaNewerSnapshots: number = 11;
	private lags: number = 0;
	private readonly maxLags: number = 10;
	private lastLagTime: number = 0;

	constructor() {}

	getPing(): number {
		return this.ping;
	}

	getTimeDiference(): number {
		return this.timeDiference;
	}

	changeSumaNewer(sumaNewer: number): void {
		//lag
		if (sumaNewer === 0) {
			this.lags++;
			this.lastLagTime = Date.now();
			console.log('lag');
		}
		//more NewerSnapshots
		if (this.lags === this.maxLags) {
			if (this.wantedSumaNewerSnapshots < this.maxWantedSumaNewerSnapshots) {
				this.wantedSumaNewerSnapshots++;
				console.log('this.wantedSumaNewerSnapshots', this.wantedSumaNewerSnapshots);
				this.lags = 0;
			}
		}
		//less newerSnapshots
		const gap = 1000 * 10;
		if (this.lastLagTime && this.lastLagTime + gap < Date.now()) {
			if (this.wantedSumaNewerSnapshots > this.minWantedSumaNewerSnapshots) {
				this.wantedSumaNewerSnapshots--;
				this.lags = 0;
				this.lastLagTime = Date.now();
				console.log('this.wantedSumaNewerSnapshots', this.wantedSumaNewerSnapshots);
			}
		}

		switch (this.wantedSumaNewerSnapshots) {
			case 3:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(0.5);
				if (sumaNewer === 2) this.changeDrawDelay(0.2);

				if (sumaNewer === 4) this.changeDrawDelay(-0.2);
				if (sumaNewer === 5) this.changeDrawDelay(-0.5);
				if (sumaNewer === 6) this.changeDrawDelay(-2);
				if (sumaNewer === 7) this.changeDrawDelay(-2);
				if (sumaNewer === 8) this.changeDrawDelay(-5);

				if (sumaNewer > 8) this.changeDrawDelay(-10);
				break;

			case 4:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(2);
				if (sumaNewer === 2) this.changeDrawDelay(0.5);
				if (sumaNewer === 3) this.changeDrawDelay(0.2);

				if (sumaNewer === 5) this.changeDrawDelay(-0.2);
				if (sumaNewer === 6) this.changeDrawDelay(-0.5);
				if (sumaNewer === 7) this.changeDrawDelay(-2);
				if (sumaNewer === 8) this.changeDrawDelay(-2);
				if (sumaNewer === 9) this.changeDrawDelay(-5);

				if (sumaNewer > 9) this.changeDrawDelay(-10);
				break;

			case 5:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(2);
				if (sumaNewer === 2) this.changeDrawDelay(1);
				if (sumaNewer === 3) this.changeDrawDelay(0.5);
				if (sumaNewer === 4) this.changeDrawDelay(0.2);

				if (sumaNewer === 6) this.changeDrawDelay(-0.2);
				if (sumaNewer === 7) this.changeDrawDelay(-0.5);
				if (sumaNewer === 8) this.changeDrawDelay(-2);
				if (sumaNewer === 9) this.changeDrawDelay(-2);
				if (sumaNewer === 10) this.changeDrawDelay(-5);

				if (sumaNewer > 10) this.changeDrawDelay(-10);
				break;

			case 6:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(2);
				if (sumaNewer === 2) this.changeDrawDelay(1);
				if (sumaNewer === 3) this.changeDrawDelay(0.5);
				if (sumaNewer === 4) this.changeDrawDelay(0.5);
				if (sumaNewer === 5) this.changeDrawDelay(0.2);

				if (sumaNewer === 7) this.changeDrawDelay(-0.2);
				if (sumaNewer === 8) this.changeDrawDelay(-0.5);
				if (sumaNewer === 9) this.changeDrawDelay(-2);
				if (sumaNewer === 10) this.changeDrawDelay(-2);
				if (sumaNewer === 11) this.changeDrawDelay(-5);

				if (sumaNewer > 11) this.changeDrawDelay(-10);
				break;

			case 7:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(2);
				if (sumaNewer === 2) this.changeDrawDelay(1);
				if (sumaNewer === 3) this.changeDrawDelay(0.5);
				if (sumaNewer === 4) this.changeDrawDelay(0.5);
				if (sumaNewer === 5) this.changeDrawDelay(0.2);
				if (sumaNewer === 6) this.changeDrawDelay(0.2);

				if (sumaNewer === 8) this.changeDrawDelay(-0.2);
				if (sumaNewer === 9) this.changeDrawDelay(-0.5);
				if (sumaNewer === 10) this.changeDrawDelay(-2);
				if (sumaNewer === 11) this.changeDrawDelay(-2);
				if (sumaNewer === 12) this.changeDrawDelay(-5);

				if (sumaNewer > 12) this.changeDrawDelay(-10);
				break;

			case 8:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(2);
				if (sumaNewer === 2) this.changeDrawDelay(1);
				if (sumaNewer === 3) this.changeDrawDelay(1);
				if (sumaNewer === 4) this.changeDrawDelay(0.5);
				if (sumaNewer === 5) this.changeDrawDelay(0.5);
				if (sumaNewer === 6) this.changeDrawDelay(0.2);
				if (sumaNewer === 7) this.changeDrawDelay(0.2);

				if (sumaNewer === 9) this.changeDrawDelay(-0.2);
				if (sumaNewer === 10) this.changeDrawDelay(-0.5);
				if (sumaNewer === 11) this.changeDrawDelay(-2);
				if (sumaNewer === 12) this.changeDrawDelay(-2);
				if (sumaNewer === 13) this.changeDrawDelay(-5);

				if (sumaNewer > 13) this.changeDrawDelay(-10);
				break;

			case 9:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(2);
				if (sumaNewer === 2) this.changeDrawDelay(2);
				if (sumaNewer === 3) this.changeDrawDelay(1);
				if (sumaNewer === 4) this.changeDrawDelay(1);
				if (sumaNewer === 5) this.changeDrawDelay(0.5);
				if (sumaNewer === 6) this.changeDrawDelay(0.5);
				if (sumaNewer === 7) this.changeDrawDelay(0.2);
				if (sumaNewer === 8) this.changeDrawDelay(0.2);

				if (sumaNewer === 10) this.changeDrawDelay(-0.2);
				if (sumaNewer === 11) this.changeDrawDelay(-0.5);
				if (sumaNewer === 12) this.changeDrawDelay(-2);
				if (sumaNewer === 13) this.changeDrawDelay(-2);
				if (sumaNewer === 14) this.changeDrawDelay(-5);

				if (sumaNewer > 14) this.changeDrawDelay(-10);
				break;

			case 10:
				if (sumaNewer === 0) this.changeDrawDelay(5);
				if (sumaNewer === 1) this.changeDrawDelay(5);
				if (sumaNewer === 2) this.changeDrawDelay(2);
				if (sumaNewer === 3) this.changeDrawDelay(2);
				if (sumaNewer === 4) this.changeDrawDelay(1);
				if (sumaNewer === 5) this.changeDrawDelay(1);
				if (sumaNewer === 6) this.changeDrawDelay(0.5);
				if (sumaNewer === 7) this.changeDrawDelay(0.5);
				if (sumaNewer === 8) this.changeDrawDelay(0.2);
				if (sumaNewer === 9) this.changeDrawDelay(0.2);

				if (sumaNewer === 11) this.changeDrawDelay(-0.2);
				if (sumaNewer === 12) this.changeDrawDelay(-0.5);
				if (sumaNewer === 13) this.changeDrawDelay(-2);
				if (sumaNewer === 14) this.changeDrawDelay(-2);
				if (sumaNewer === 15) this.changeDrawDelay(-5);

				if (sumaNewer > 5) this.changeDrawDelay(-10);
				break;

			case 11:
				if (sumaNewer === 0) this.changeDrawDelay(10);
				if (sumaNewer === 1) this.changeDrawDelay(5);
				if (sumaNewer === 2) this.changeDrawDelay(2);
				if (sumaNewer === 3) this.changeDrawDelay(2);
				if (sumaNewer === 4) this.changeDrawDelay(2);
				if (sumaNewer === 5) this.changeDrawDelay(1);
				if (sumaNewer === 6) this.changeDrawDelay(1);
				if (sumaNewer === 7) this.changeDrawDelay(0.5);
				if (sumaNewer === 8) this.changeDrawDelay(0.5);
				if (sumaNewer === 9) this.changeDrawDelay(0.2);
				if (sumaNewer === 10) this.changeDrawDelay(0.2);

				if (sumaNewer === 12) this.changeDrawDelay(-0.2);
				if (sumaNewer === 13) this.changeDrawDelay(-0.5);
				if (sumaNewer === 14) this.changeDrawDelay(-2);
				if (sumaNewer === 15) this.changeDrawDelay(-2);
				if (sumaNewer === 16) this.changeDrawDelay(-5);
				if (sumaNewer > 16) this.changeDrawDelay(-10);
				break;
		}
	}

	ready(): boolean {
		return this.pings.length === this.pingAttempts;
	}

	reset(): void {
		this.pings = [];
		this.timeDiferences = [];
		this.ping = 0;
		this.timeDiference = 0;
		this.drawDelay = this.defaultDrawDelay;
		this.wantedSumaNewerSnapshots = this.defaultWantedNewerSnapshots;
		this.lags = 0;
		this.lastLagTime = 0;
	}

	addData(ping: number, timeDiference: number): void {
		if (!this.ready()) {
			this.pings.push(ping);
			this.timeDiferences.push(timeDiference);
		}
		//count average
		if (this.pings.length === this.pingAttempts) {
			let pingsSuma = 0;
			for (const ping of this.pings) {
				pingsSuma += ping;
			}
			this.ping = pingsSuma / this.pingAttempts;
			let timeDiferenceSuma = 0;
			for (const timeDiference of this.timeDiferences) {
				timeDiferenceSuma += timeDiference;
			}
			this.timeDiference = timeDiferenceSuma / this.pingAttempts;
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
