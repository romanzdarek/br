import Point from './Point';

export default class RotateCollisionPoints {
	private points: Point[];
	private rotatePoints: Point[][] = [];
	private size: number;

	constructor(points: Point[], size: number) {
		this.size = size;
		this.points = points;
		this.rotate();
	}

	//zrotujeme body kolem přostředního pixelu
	//je třeba obrázek s lichou delkou stran - musíme vybrat prostřední pixel!
	private rotate(): void {
		const centerX = Math.floor(this.size / 2);
		const centerY = Math.floor(this.size / 2);

		//rotace: http://ottp.fme.vutbr.cz/users/pavelek/optika/1503.htm
		for (let shiftAngle = 0; shiftAngle < 360; shiftAngle++) {
			this.rotatePoints[shiftAngle] = [];
			for (let point = 0; point < this.points.length; point++) {
				let x, y, newX, newY;
				//posun počítany od středu
				//centerX neni width/2 ale prostřední pixel tj. při délce 5 je to 2 (prvni px je na pozici 0)
				x = centerX - this.points[point].x;
				y = centerY - this.points[point].y;
				//posun o úhel
				newX =
					x * Math.cos((shiftAngle + 180) * Math.PI / 180) - y * Math.sin((shiftAngle + 180) * Math.PI / 180);
				newY =
					x * Math.sin((shiftAngle + 180) * Math.PI / 180) + y * Math.cos((shiftAngle + 180) * Math.PI / 180);
				//posunutí do původni pozice
				newX = newX + centerX;
				newY = newY + centerY;
				this.rotatePoints[shiftAngle][point] = { x: newX, y: newY };
			}
		}
	}

	getPointsForAngle(angle: number): Point[] {
		return this.rotatePoints[angle];
	}

	getAllPoints(): Point[][] {
		return this.rotatePoints;
	}
}
