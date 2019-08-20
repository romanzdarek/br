"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Snapshot {
    constructor(time, players, bullets, granades, smokes, zone, loots, obstacles, messages, myPlayerSnapshot) {
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
    }
}
exports.default = Snapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFTQSxNQUFxQixRQUFRO0lBVzVCLFlBQ0MsSUFBWSxFQUNaLE9BQXlCLEVBQ3pCLE9BQXlCLEVBQ3pCLFFBQWtDLEVBQ2xDLE1BQTRCLEVBQzVCLElBQWtCLEVBQ2xCLEtBQXFCLEVBQ3JCLFNBQTZCLEVBQzdCLFFBQWtCLEVBQ2xCLGdCQUFtQztRQUVuQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDZixJQUFJLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNuQixJQUFJLFFBQVEsQ0FBQyxNQUFNO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDdkMsSUFBSSxnQkFBZ0I7WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLGdCQUFnQixDQUFDO0lBQ2pELENBQUM7Q0FDRDtBQWxDRCwyQkFrQ0MifQ==