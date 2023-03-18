import { ObstacleType } from './obstacle/ObstacleType';

export default interface ObstacleSnapshot {
	id: number;
	opacity: number;
	type: ObstacleType;
	x: number;
	y: number;
	width?: number;
	height?: number;
	size?: number;
}
