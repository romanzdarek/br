export default class Scope {
	private loadingMax: number = 60;
	private loading: number = this.loadingMax;
	private scope: number = 0.01; //1
	private scopeLoadingChange: number = 0;
	private scopeResolutionAdjustment: number = 0.01; //1

	setScope(newScope: number): void {
		switch (newScope) {
			case 2:
				newScope = 1.2;
				break;
			case 4:
				newScope = 1.4;
				break;
			case 6:
				newScope = 1.6;
				break;
		}
		const oldScope = this.scope;
		this.scope = newScope;
		if (newScope !== oldScope) {
			this.scopeLoadingChange = (newScope - oldScope) / this.loadingMax;
			this.loading = 0;
		}
	}

	getFinalResolutionAdjustment(resolutionAdjustment: number, adjustFrameRate: number): number {
		if (this.loading <= this.loadingMax) {
			this.scopeResolutionAdjustment += this.scopeLoadingChange * adjustFrameRate;
			this.loading += 1 * adjustFrameRate;
		}
		return resolutionAdjustment / this.scopeResolutionAdjustment;
	}
}
