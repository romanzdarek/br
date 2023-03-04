"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ThrowingObject_1 = require("./ThrowingObject");
const Sound_1 = require("./Sound");
class Granade extends ThrowingObject_1.default {
    constructor(player, hand, targetX, targetY, sounds, touchDelay) {
        super(player, hand, targetX, targetY, touchDelay);
        this.fragmentRange = 22;
        this.fragmentSpeed = 6;
        this.fragmentSpray = 20;
        this.fragmentCount = 20;
        this.sounds = sounds;
    }
    createExplodeSound() {
        this.sounds.push(new Sound_1.default(Sound_1.SoundType.Granade, this.getX(), this.getY()));
    }
}
exports.default = Granade;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhbmFkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9HcmFuYWRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQThDO0FBRzlDLG1DQUEyQztBQUUzQyxNQUFxQixPQUFRLFNBQVEsd0JBQWM7SUFPbEQsWUFBWSxNQUFjLEVBQUUsSUFBVSxFQUFFLE9BQWUsRUFBRSxPQUFlLEVBQUUsTUFBZSxFQUFFLFVBQWtCO1FBQzVHLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFQMUMsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFDM0Isa0JBQWEsR0FBVyxDQUFDLENBQUM7UUFDMUIsa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFDM0Isa0JBQWEsR0FBVyxFQUFFLENBQUM7UUFLbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsQ0FBQztJQUVELGtCQUFrQjtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGVBQUssQ0FBQyxpQkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0NBQ0Q7QUFmRCwwQkFlQyJ9