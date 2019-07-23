import ZoneCircle from './ZoneCircle';

export default class Zone {
	innerCircle: ZoneCircle;
	outerCircle: ZoneCircle;

	constructor() {
        this.innerCircle = new ZoneCircle(0, 0, 0);
        this.outerCircle = new ZoneCircle(0, 0, 0);
    }
    
}
