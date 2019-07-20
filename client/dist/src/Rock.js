import RoundObstacle from './RoundObstacle';
export default class Rock extends RoundObstacle {
    constructor(id, x, y) {
        const size = 100;
        super(id, x, y, size);
        this.opacity = 1;
    }
}
//# sourceMappingURL=Rock.js.map