import Point from './Point';

export default class CollisionPoints {
	body: Point[] = [];
	hand: Point[] = [];
	mace: Point[][] = [];
	sword: Point[][] = [];
	halberd: Point[][] = [];
	ready: boolean = false;

	setData(body: Point[], hand: Point[], mace: Point[][], sword: Point[][], halberd: Point[][]) {
		this.body = body;
		this.hand = hand;
		this.mace = mace;
		this.sword = sword;
		this.halberd = halberd;
		this.ready = true;
	}

	isReady(): boolean {
		return this.ready;
	}
}
