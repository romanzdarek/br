"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player_1 = require("./Player");
const Weapon_1 = require("./Weapon");
class SmokeCloud {
    constructor(smoke, angle) {
        this.step = 0;
        this.owner = smoke.player;
        const cloudSpeed = 0.1 + Math.random() / 10;
        const cloudSpray = 20 + Math.random() * 5;
        this.x = smoke.getX();
        this.y = smoke.getY();
        this.size = 50 + Math.random() * 5;
        this.opacity = 0.1;
        //random change angle
        let randomchange = Math.round(Math.random() * cloudSpray * 100) / 100;
        let randomDirection = Math.round(Math.random());
        if (!randomDirection)
            randomDirection = -1;
        this.angle = angle + randomchange * randomDirection;
        if (this.angle < 0) {
            this.angle = 360 + this.angle;
        }
        if (this.angle >= 360) {
            this.angle = 360 - this.angle;
        }
        //shift cloud
        this.shiftX = Math.sin((this.angle * Math.PI) / 180) * cloudSpeed;
        this.shiftY = Math.cos((this.angle * Math.PI) / 180) * cloudSpeed;
    }
    hitPlayer(player) {
        const damage = 0.1;
        const xDistance = Math.abs(player.getCenterX() - this.x);
        const yDistance = Math.abs(player.getCenterY() - this.y);
        const centerPlayerToCenterCloud = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
        if (centerPlayerToCenterCloud < Player_1.Player.radius + this.size / 2) {
            player.acceptHit(damage, this.owner, Weapon_1.Weapon.Smoke);
        }
    }
    move() {
        if (this.step < 200) {
            this.opacity += 0.005;
            if (this.opacity > 1)
                this.opacity = 1;
            this.size += 3;
        }
        else if (this.step < 230) {
            this.size += 2;
        }
        else if (this.step < 260) {
            this.size += 1.5;
        }
        else if (this.step < 290) {
            this.size += 1;
        }
        else if (this.step < 320) {
            this.size += 0.5;
        }
        else if (this.step < 350) {
            this.size += 0.3;
        }
        else if (this.step < 400) {
            this.size += 0.2;
        }
        else if (this.step < 1500) {
            this.size += 0.1;
        }
        else {
            this.opacity -= 0.005;
            if (this.opacity < 0)
                this.opacity = 0;
        }
        this.x += this.shiftX;
        this.y += this.shiftY;
        this.step++;
        /*
        if (this.step < this.steps / 2) {
            this.opacity += opacityIncrease + opacityIncrease;
            this.x += this.shiftX + this.shiftX;
            this.y += this.shiftY + this.shiftY;
            this.size += 2;
            this.step++;
            this.step++;
        } else {
            this.opacity -= opacityIncrease;
            if (this.opacity < 0) this.opacity = 0;
            this.x += this.shiftX;
            this.y += this.shiftY;
            this.size += 0.5;
            this.step++;
        }
        */
    }
    isActive() {
        return this.opacity > 0;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getSize() {
        return this.size;
    }
    getOpacity() {
        return this.opacity;
    }
}
exports.default = SmokeCloud;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU21va2VDbG91ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TbW9rZUNsb3VkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQWtDO0FBQ2xDLHFDQUFrQztBQUdsQyxNQUFxQixVQUFVO0lBVzlCLFlBQVksS0FBWSxFQUFFLEtBQWE7UUFIL0IsU0FBSSxHQUFXLENBQUMsQ0FBQztRQUl4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDNUMsTUFBTSxVQUFVLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixxQkFBcUI7UUFDckIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUN0RSxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxlQUFlO1lBQUUsZUFBZSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLFlBQVksR0FBRyxlQUFlLENBQUM7UUFDcEQsSUFBSSxJQUFJ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