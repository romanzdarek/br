export default class Scope {
	private stepsToChangeScope: number = 40;
	private scopeStepChange: number = 0;
	private scope: number = 0.01; //1
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
		this.scope = newScope;

		if (this.scope !== this.scopeResolutionAdjustment) {
			this.scopeStepChange = (this.scope - this.scopeResolutionAdjustment) / this.stepsToChangeScope;
		}
	}

	getFinalResolutionAdjustment(resolutionAdjustment: number, adjustFrameRate: number): number {
		// zoom in
		if (this.scopeResolutionAdjustment < this.scope && this.scopeStepChange > 0) {
			this.scopeResolutionAdjustment += this.scopeStepChange * adjustFrameRate;
		}

		// zoom out
		if (this.scopeResolutionAdjustment > this.scope && this.scopeStepChange < 0) {
			this.scopeResolutionAdjustment += this.scopeStepChange * adjustFrameRate;
		}

		return resolutionAdjustment / this.scopeResolutionAdjustment;
	}
}
