export default class CollisionPoints {
    constructor() {
        this.body = [];
        this.hand = [];
        this.hammer = [];
        this.ready = false;
    }
    setData(body, hand, hammer) {
        this.body = body;
        this.hand = hand;
        this.hammer = hammer;
        this.ready = true;
    }
    isReady() {
        return this.ready;
    }
}
//# sourceMappingURL=CollisionPoints.js.map