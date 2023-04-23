"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SoundType;
(function (SoundType) {
    SoundType[SoundType["Pistol"] = 0] = "Pistol";
    SoundType[SoundType["Shotgun"] = 1] = "Shotgun";
    SoundType[SoundType["Rifle"] = 2] = "Rifle";
    SoundType[SoundType["Machinegun"] = 3] = "Machinegun";
    SoundType[SoundType["Grenade"] = 4] = "Grenade";
    SoundType[SoundType["Punch"] = 5] = "Punch";
    SoundType[SoundType["Water"] = 6] = "Water";
    SoundType[SoundType["Hit"] = 7] = "Hit";
    SoundType[SoundType["Footstep"] = 8] = "Footstep";
    SoundType[SoundType["HandWeapon"] = 9] = "HandWeapon";
    SoundType[SoundType["Throw"] = 10] = "Throw";
    SoundType[SoundType["SwordBlock"] = 11] = "SwordBlock";
})(SoundType = exports.SoundType || (exports.SoundType = {}));
class Sound {
    constructor(soundType, x, y, playerId) {
        this.soundType = soundType;
        this.x = x;
        this.y = y;
        this.playerId = playerId;
    }
}
exports.default = Sound;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU291bmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU291bmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFZLFNBYVg7QUFiRCxXQUFZLFNBQVM7SUFDcEIsNkNBQU0sQ0FBQTtJQUNOLCtDQUFPLENBQUE7SUFDUCwyQ0FBSyxDQUFBO0lBQ0wscURBQVUsQ0FBQTtJQUNWLCtDQUFPLENBQUE7SUFDUCwyQ0FBSyxDQUFBO0lBQ0wsMkNBQUssQ0FBQTtJQUNMLHVDQUFHLENBQUE7SUFDSCxpREFBUSxDQUFBO0lBQ1IscURBQVUsQ0FBQTtJQUNWLDRDQUFLLENBQUE7SUFDTCxzREFBVSxDQUFBO0FBQ1gsQ0FBQyxFQWJXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBYXBCO0FBRUQsTUFBcUIsS0FBSztJQU16QixZQUFZLFNBQW9CLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxRQUFpQjtRQUN4RSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDMUIsQ0FBQztDQUNEO0FBWkQsd0JBWUMifQ==