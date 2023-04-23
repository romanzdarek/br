"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Snapshot {
    constructor(time, players, bullets, grenades, smokes, zone, loots, obstacles, messages, waterCircleSnapshots, sounds, myPlayerSnapshot) {
        this.t = time;
        this.p = players;
        this.b = bullets;
        this.g = grenades;
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
        if (sounds.length)
            this.sounds = sounds;
    }
}
exports.default = Snapshot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU25hcHNob3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU25hcHNob3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFXQSxNQUFxQixRQUFRO0lBYzVCLFlBQ0MsSUFBWSxFQUNaLE9BQXlCLEVBQ3pCLE9BQXlCLEVBQ3pCLFFBQWtDLEVBQ2xDLE1BQTRCLEVBQzVCLElBQWtCLEVBQ2xCLEtBQXFCLEVBQ3JCLFNBQTZCLEVBQzdCLFFBQWtCLEVBQ2xCLG9CQUEyQyxFQUMzQyxNQUFlLEVBQ2YsZ0JBQW1DO1FBRW5DLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ2QsSUFBSSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDakIsSUFBSSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDaEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDZCxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNmLElBQUksQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQ25CLElBQUksUUFBUSxDQUFDLE1BQU07WUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztRQUN2QyxJQUFJLGdCQUFnQjtZQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUM7UUFDaEQsSUFBSSxvQkFBb0IsQ0FBQyxNQUFNO1lBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztRQUMvRCxJQUFJLE1BQU0sQ0FBQyxNQUFNO1lBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekMsQ0FBQztDQUNEO0FBekNELDJCQXlDQyJ9