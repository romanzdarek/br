"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Gun {
    constructor(length, range, bulletSpeed, spray, bullets, bulletsMax) {
        this.range = range;
        this.bulletSpeed = bulletSpeed;
        this.length = length;
        this.spray = spray;
        this.bullets = bullets;
        this.bulletsMax = bulletsMax;
    }
    ready() {
        return this.bullets > 0;
    }
    fire() {
        this.bullets--;
    }
    reload(bullets) {
        this.bullets = bullets;
    }
    getBullets() {
        return this.bullets;
    }
}
exports.default = Gun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3VuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0d1bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQXFCLEdBQUc7SUFRdkIsWUFBWSxNQUFjLEVBQUUsS0FBYSxFQUFFLFdBQW1CLEVBQUUsS0FBYSxFQUFFLE9BQWUsRUFBRSxVQUFrQjtRQUNqSCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztJQUM5QixDQUFDO0lBRUQsS0FBSztRQUNKLE9BQU8sSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUk7UUFDSCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFlO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxVQUFVO1FBQ1QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3JCLENBQUM7Q0FDRDtBQWhDRCxzQkFnQ0MifQ==