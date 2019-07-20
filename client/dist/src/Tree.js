import RoundObstacle from './RoundObstacle';
export default class Tree extends RoundObstacle {
    constructor(id, x, y) {
        const size = 200;
        super(id, x, y, size);
        this.treeTrankRadius = 35;
        this.opacity = 0.9;
    }
}
//# sourceMappingURL=Tree.js.map