export default class Gun {
    readonly size: number = 70;
    readonly range: number;
	readonly playerRadius: number;
	private x: number = 0;
	private y: number = 0;
	private angle: number = 0;

	constructor(playerSize: number, range: number) {
        this.playerRadius = playerSize / 2;
        this.range = range;
	}

	move(playerAngle: number, playerCenterX: number, playerCenterY: number): void {
		this.angle = playerAngle;
		//triangle
		const x = Math.sin(this.angle * Math.PI / 180) * this.playerRadius;
		const y = Math.cos(this.angle * Math.PI / 180) * this.playerRadius;
		//set final position from center
		this.x = playerCenterX + x - this.size / 2;
		this.y = playerCenterY - y - this.size / 2;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getAngle(): number {
		return this.angle;
	}

	ready(): boolean {
		return true;
	}
}
