import Map from '../map/Map';
import { Player } from '../player/Player';
import Point from '../Point';
import Bush from './Bush';
import Camo from './Camo';
import { ObstacleType } from './ObstacleType';
import Rock from './Rock';
import RoundObstacle from './RoundObstacle';
import Tree from './Tree';

export default abstract class RectangleObstacle {
	readonly id: number;
	protected changed: boolean = false;
	x: number;
	y: number;
	protected opacity: number = 1;
	protected health: number;
	protected healthMax: number;
	width: number;
	height: number;
	private active: boolean = true;
	type: ObstacleType;
	protected fixedPosition: boolean = true;

	constructor(id: number, x: number, y: number, width: number, height: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	hasFixedPosition() {
		return this.fixedPosition;
	}

	getChanged(): boolean {
		return this.changed;
	}

	change() {
		this.changed = true;
	}

	nullChanged(): void {
		this.changed = false;
	}

	isPointIn(point: Point): boolean {
		const { x, y } = point;
		if (x < this.x + this.width && x >= this.x && y >= this.y && y < this.y + this.height) {
			return true;
		}
		return false;
	}

	getOpacity(): number {
		return this.opacity;
	}

	isActive(): boolean {
		return this.active;
	}

	shift(shiftX: number, shiftY: number, map: Map, players: Player[]) {
		if (this.fixedPosition) return;

		function circleRectCollision(circleX, circleY, circleRadius, rectX, rectY, rectWidth, rectHeight) {
			// Find the closest point on the rectangle to the center of the circle
			let closestX = clamp(circleX, rectX, rectX + rectWidth);
			let closestY = clamp(circleY, rectY, rectY + rectHeight);

			// Calculate the distance between the closest point and the center of the circle
			let distanceX = circleX - closestX;
			let distanceY = circleY - closestY;
			let distanceSquared = distanceX * distanceX + distanceY * distanceY;

			// Check for collision
			if (distanceSquared <= circleRadius * circleRadius) {
				return true;
			}

			// Check for collision on edges of rectangle
			let rectTop = rectY;
			let rectBottom = rectY + rectHeight;
			let rectLeft = rectX;
			let rectRight = rectX + rectWidth;

			let edgeDistanceX, edgeDistanceY;
			if (circleX < rectLeft) {
				edgeDistanceX = rectLeft - circleX;
			} else if (circleX > rectRight) {
				edgeDistanceX = circleX - rectRight;
			} else {
				edgeDistanceX = 0;
			}

			if (circleY < rectTop) {
				edgeDistanceY = rectTop - circleY;
			} else if (circleY > rectBottom) {
				edgeDistanceY = circleY - rectBottom;
			} else {
				edgeDistanceY = 0;
			}

			let edgeDistanceSquared = edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY;
			return edgeDistanceSquared <= circleRadius * circleRadius;
		}

		function clamp(value, min, max) {
			return Math.min(Math.max(value, min), max);
		}

		let collistionOnShiftX = false;
		for (const obstacle of map.rectangleObstacles) {
			if (this === obstacle) continue;
			if (obstacle.type === ObstacleType.Camo) continue;
			if (!obstacle.isActive()) continue;
			if (
				this.x + shiftX + this.width >= obstacle.x &&
				this.x + shiftX <= obstacle.x + obstacle.width &&
				this.y + this.height >= obstacle.y &&
				this.y <= obstacle.y + obstacle.height
			) {
				collistionOnShiftX = true;
				break;
			}
		}

		for (const player of players) {
			if (
				this.x + shiftX + this.width >= player.getX() &&
				this.x + shiftX <= player.getX() + Player.size &&
				this.y + this.height >= player.getY() &&
				this.y <= player.getY() + Player.size &&
				circleRectCollision(player.getCenterX(), player.getCenterY(), Player.radius, this.x + shiftX, this.y, this.width, this.height)
			) {
				collistionOnShiftX = true;
				break;
			}
		}

		for (let obstacle of map.roundObstacles) {
			if (obstacle instanceof Bush) continue;
			if (!obstacle.isActive()) continue;
			if (obstacle instanceof Tree) {
				// solid tree trunk made from rock
				obstacle = new Rock(
					0,
					obstacle.getCenterX() - obstacle.treeTrankRadius,
					obstacle.getCenterY() - obstacle.treeTrankRadius,
					obstacle.treeTrankRadius * 2
				);
			}
			if (
				this.x + shiftX + this.width >= obstacle.x &&
				this.x + shiftX <= obstacle.x + obstacle.size &&
				this.y + this.height >= obstacle.y &&
				this.y <= obstacle.y + obstacle.size &&
				circleRectCollision(obstacle.getCenterX(), obstacle.getCenterY(), obstacle.radius, this.x + shiftX, this.y, this.width, this.height)
			) {
				collistionOnShiftX = true;
				break;

				/*
				for (const collisionPoint of obstacle.collisionPoints) {
					if (
						collisionPoint.x >= this.x + shiftX &&
						collisionPoint.x <= this.x + shiftX + this.width &&
						collisionPoint.y >= this.y &&
						collisionPoint.y <= this.y + this.height
					) {
						collistionOnShiftX = true;
						break;
					}
				}
				*/
			}
		}
		if (!collistionOnShiftX) {
			this.x += shiftX;
		}

		let collistionOnShiftY = false;
		for (const obstacle of map.rectangleObstacles) {
			if (this === obstacle) continue;
			if (obstacle.type === ObstacleType.Camo) continue;
			if (!obstacle.isActive()) continue;
			if (
				this.x + this.width >= obstacle.x &&
				this.x <= obstacle.x + obstacle.width &&
				this.y + shiftY + this.height >= obstacle.y &&
				this.y + shiftY <= obstacle.y + obstacle.height
			) {
				collistionOnShiftY = true;
				break;
			}
		}

		for (const player of players) {
			if (
				this.x + this.width >= player.getX() &&
				this.x <= player.getX() + Player.size &&
				this.y + shiftY + this.height >= player.getY() &&
				this.y + shiftY <= player.getY() + Player.size &&
				circleRectCollision(player.getCenterX(), player.getCenterY(), Player.radius, this.x, this.y + shiftY, this.width, this.height)
			) {
				collistionOnShiftY = true;
				break;
			}
		}

		for (let obstacle of map.roundObstacles) {
			if (obstacle instanceof Bush) continue;
			if (!obstacle.isActive()) continue;
			if (obstacle instanceof Tree) {
				// solid tree trunk made from rock
				obstacle = new Rock(
					0,
					obstacle.getCenterX() - obstacle.treeTrankRadius,
					obstacle.getCenterY() - obstacle.treeTrankRadius,
					obstacle.treeTrankRadius * 2
				);
			}
			if (
				this.x + this.width >= obstacle.x &&
				this.x <= obstacle.x + obstacle.size &&
				this.y + shiftY + this.height >= obstacle.y &&
				this.y + shiftY <= obstacle.y + obstacle.size &&
				circleRectCollision(obstacle.getCenterX(), obstacle.getCenterY(), obstacle.radius, this.x, this.y + shiftY, this.width, this.height)
			) {
				collistionOnShiftY = true;
				break;

				/*
				for (const collisionPoint of obstacle.collisionPoints) {
					if (
						collisionPoint.x >= this.x &&
						collisionPoint.x <= this.x + this.width &&
						collisionPoint.y >= this.y + shiftY &&
						collisionPoint.y <= this.y + shiftY + this.height
					) {
						collistionOnShiftY = true;
						break;
					}
				}*/
			}
		}
		if (!collistionOnShiftY) {
			this.y += shiftY;
		}

		this.change();
	}

	acceptHit(power: number, hitedBy?: any): void {
		if (this.active) {
			this.health -= power;
			const change = Math.round((this.health / this.healthMax) * 10) / 10;
			this.opacity = change;
			const previousWidth = this.width;
			const previousHeight = this.height;

			this.width *= change;
			this.height *= change;

			this.x += (previousWidth - this.width) / 2;
			this.y += (previousHeight - this.height) / 2;

			if (this.opacity <= 0.7) {
				this.opacity = 0;
				this.active = false;
			}
			this.changed = true;
		}
	}
}
