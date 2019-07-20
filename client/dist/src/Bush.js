import RoundObstacle from './RoundObstacle';
export default class Bush extends RoundObstacle {
    constructor(id, x, y) {
        const size = 100;
        super(id, x, y, size);
        this.opacity = 0.9;
    }
}
//# sourceMappingURL=Bush.js.map