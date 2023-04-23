import ObstacleSnapshot from '../ObstacleSnapshot';
import Block from './Block';
import Box from './Box';
import { ObstacleType } from './ObstacleType';

export default abstract class RectangleObstacle {
	readonly id: number;
	protected changed: boolean = false;
	x: number;
	y: number;
	protected opacity: number = 1;
	width: number;
	height: number;
	private active: boolean = true;
	type: ObstacleType;

	constructor(id: number, x: number, y: number, width: number, height: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	update(obstacle: ObstacleSnapshot): void {
		this.opacity = obstacle.opacity;
		this.x = obstacle.x;
		this.y = obstacle.y;
		this.width = obstacle.width;
		this.height = obstacle.height;
	}

	getOpacity(): number {
		return this.opacity;
	}

	isActive(): boolean {
		return this.active;
	}

	increaseOpacity(adjustFrameRate: number) {
		this.opacity += 0.01 * adjustFrameRate;
		if (this.opacity > 1) this.opacity = 1;
	}

	decreaseOpacity(adjustFrameRate: number) {
		this.opacity -= 0.02 * adjustFrameRate;
		if (this.opacity < 0.7) this.opacity = 0.7;
	}
}
