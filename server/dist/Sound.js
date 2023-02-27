"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SoundType;
(function (SoundType) {
    SoundType[SoundType["Pistol"] = 0] = "Pistol";
    SoundType[SoundType["Shotgun"] = 1] = "Shotgun";
    SoundType[SoundType["Rifle"] = 2] = "Rifle";
    SoundType[SoundType["Machinegun"] = 3] = "Machinegun";
    SoundType[SoundType["Granade"] = 4] = "Granade";
    SoundType[SoundType["Punch"] = 5] = "Punch";
    SoundType[SoundType["Water"] = 6] = "Water";
    SoundType[SoundType["Hit"] = 7] = "Hit";
    SoundType[SoundType["Footstep"] = 8] = "Footstep";
    SoundType[SoundType["Hammer"] = 9] = "Hammer";
    SoundType[SoundType["Throw"] = 10] = "Throw";
})(SoundType = exports.SoundType || (exports.SoundType = {}));
class Sound {
    constructor(soundType, x, y) {
        this.soundType = soundType;
        this.x = x;
        this.y = y;
    }
}
exports.default = Sound;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU291bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLFNBWVg7QUFaRCxXQUFZLFNBQVM7SUFDcEIsNkNBQU0sQ0FBQTtJQUNOLCtDQUFPLENBQUE7SUFDUCwyQ0FBSyxDQUFBO0lBQ0wscURBQVUsQ0FBQTtJQUNWLCtDQUFPLENBQUE7SUFDUCwyQ0FBSyxDQUFBO0lBQ0wsMkNBQUssQ0FBQTtJQUNMLHVDQUFHLENBQUE7SUFDSCxpREFBUSxDQUFBO0lBQ1IsNkNBQU0sQ0FBQTtJQUNOLDRDQUFLLENBQUE7QUFDTixDQUFDLEVBWlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFZcEI7QUFFRCxNQUFxQixLQUFLO0lBS3pCLFlBQVksU0FBb0IsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1osQ0FBQztDQUNEO0FBVkQsd0JBVUMifQ==