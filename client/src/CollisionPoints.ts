import Point from './Point';

export default class CollisionPoints {
	body: Point[] = [];
	hand: Point[] = [];
	hammer: Point[][] = [];
	ready: boolean = false;

	setData(body: Point[], hand: Point[], hammer: Point[][]) {
		this.body = body;
		this.hand = hand;
        this.hammer = hammer;
        this.ready = true;
    }
    
    isReady(): boolean{
        return this.ready;
    }
}
