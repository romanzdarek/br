"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Snapshot {
    constructor(time, players, bullets, granades, smokes, zone, loots, obstacles, messages, waterCircleSnapshots, myPlayerSnapshot) {
        this.t = time;
        this.p = players;
        this.b = bullets;
        this.g = granades;
        this.s = smokes;
        this.z = zone;
        this.l = loots;
        this.o = obstacles;
        if (messages.length)
            this.m = messages;
        if (myPlayerSnapshot)
            this.i = myPlayerSnapshot;
        if (waterCircleSnapshots.length)
            this.w = waterCircleSnapshots;
    }
}
exports.default = Snapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxNQUFxQixRQUFRO0lBYTVCLFlBQ0MsSUFBWSxFQUNaLE9BQXlCLEVBQ3pCLE9BQXlCLEVBQ3pCLFFBQWtDLEVBQ2xDLE1BQTRCLEVBQzVCLElBQWtCLEVBQ2xCLEtBQXFCLEVBQ3JCLFNBQTZCLEVBQzdCLFFBQWtCLEVBQ2xCLG9CQUEyQyxFQUMzQyxnQkFBbUM7UUFFbkMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNqQixJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUNsQixJQUFJLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztRQUNoQixJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2YsSUFBSSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTTtZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQ3ZDLElBQUksZ0JBQWdCO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQztRQUNoRCxJQUFJLG9CQUFvQixDQUFDLE1BQU07WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLG9CQUFvQixDQUFDO0lBQ2hFLENBQUM7Q0FDRDtBQXRDRCwyQkFzQ0MifQ==