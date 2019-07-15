import Hand from './Hand';
import Gun from './Gun';
import Map from './Map';
import Point from './Point';
import Tree from './Tree';
import RoundObstacle from './RoundObstacle';
import RectangleObstacle from './RectangleObstacle';
import { TerrainType } from './Terrain';
import { Weapon } from './Weapon';

type Loading = {
	time: number;
	max: number;
};

export class Player {
	readonly size: number = 80;
	readonly radius: number = this.size / 2;
	readonly speed: number = 6;
	private x: number;
	private y: number;
	private angle: number = 0;
	private map: Map;
	hands: Hand[] = [];
	gun: Gun;
	private canvas: HTMLCanvasElement;
	readonly collisionPoints: Point[] = [];
	private slowAroundObstacle: boolean = false;
	private loadingTime: number = 0;
	private loadingMaxTime: number = 3 * 60;

	constructor(map: Map) {
		this.x = 550;
		this.y = 700;
		this.canvas = <HTMLCanvasElement>document.getElementById('gameScreen');
		this.hands.push(new Hand(this.size));
		this.hands.push(new Hand(this.size));
		this.gun = new Gun(this.size, 20);
		this.map = map;
	}
	loading(): Loading {
		if (this.loadingTime < this.loadingMaxTime) this.loadingTime++;
		return { time: this.loadingTime, max: this.loadingMaxTime };
	}

	getCenterX(): number {
		return this.x + this.radius;
	}

	getCenterY(): number {
		return this.y + this.radius;
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

	setAngle(angle: number): void {
		this.angle = angle;
	}
}
