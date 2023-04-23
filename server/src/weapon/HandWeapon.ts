import CollisionPoints from '../CollisionPoints';
import Point from '../Point';
import Map from '../map/Map';
import { Player } from '../player/Player';
import { Weapon } from './Weapon';
import Sound, { SoundType } from '../Sound';
import RotateCollisionPoints from '../RotateCollisionPoints';

export default abstract class HandWeapon {
	protected angle: number = 0;
	protected power: number = 100; //34
	protected size: number = 500; // 280
	protected active: boolean = false;

	protected hitTimer: number = 0;
	protected hitTimerMax: number = 20; // 20

	protected returnTimer = 0;
	protected returnTimerMax = 20;
	protected moveType: 'hit' | 'return';

	protected collisionPoints: CollisionPoints;
	protected player: Player;
	protected players: Player[];
	protected map: Map;
	protected hitObjects: any[] = [];
	protected moveSpeed = 8;

	protected type: Weapon;

	protected;

	constructor(myPlayer: Player, players: Player[], map: Map, collisionPoints: CollisionPoints) {
		this.player = myPlayer;
		this.players = players;
		this.map = map;
		this.collisionPoints = collisionPoints;
	}

	getType() {
		return this.type;
	}

	hit(): void {
		this.active = true;
		this.moveType = 'hit';
	}

	getAngle(): number {
		let angle = this.player.getAngle() + this.angle;
		if (angle < 0) angle = 360 + angle;
		if (angle > 359) angle = angle - 360;
		return Math.round(angle);
	}

	isActive(): boolean {
		return this.active;
	}

	ready(): boolean {
		return this.hitTimer === 0;
	}

	move(): void {
		if (this.active) {
			if (this.moveType === 'hit' && this.hitTimer <= this.hitTimerMax) {
				this.angle -= this.moveSpeed;
				this.hitTimer++;
				this.collisions();
				if (this.hitTimer === this.hitTimerMax) {
					this.moveType = 'return';
					this.returnTimer = 0;
				}
			} else if (this.moveType === 'return' && this.returnTimer <= this.returnTimerMax) {
				this.angle += this.moveSpeed;
				this.returnTimer++;

				if (this.returnTimer === this.returnTimerMax) {
					this.active = false;
					this.hitTimer = 0;
					this.returnTimer = 0;
					this.hitObjects = [];
				}
			}
		}
	}

	protected block(blockedPoint: Point) {
		this.moveType = 'return';
		this.returnTimer = this.hitTimerMax - this.hitTimer;
		const sound = new Sound(SoundType.SwordBlock, blockedPoint.x, blockedPoint.y);
		this.player.sounds.push(sound);
	}

	protected collisions(): void {
		const x = this.player.getCenterX() - this.size / 2;
		const y = this.player.getCenterY() - this.size / 2;
		const weaponCenter = new Point(x, y);

		let weaponBlockCollisionPoints: RotateCollisionPoints;
		if (this.type === Weapon.Halberd) weaponBlockCollisionPoints = this.collisionPoints.halberdBlock;
		if (this.type === Weapon.Sword) weaponBlockCollisionPoints = this.collisionPoints.swordBlock;
		if (this.type === Weapon.Mace) weaponBlockCollisionPoints = this.collisionPoints.maceBlock;

		// block colision
		// TODO: implement optimalization, compare points only if it is necessarily
		const minGap = 12;
		for (const point of weaponBlockCollisionPoints.getPointsForAngle(this.getAngle())) {
			const weaponPoint = new Point(weaponCenter.x + point.x, weaponCenter.y + point.y);
			for (const player of this.players) {
				if (player === this.player || !player.isActive()) continue;
				if (player.inventory.activeItem instanceof HandWeapon) {
					const _x = player.getCenterX() - player.inventory.activeItem.size / 2;
					const _y = player.getCenterY() - player.inventory.activeItem.size / 2;
					const _weaponCenter = new Point(_x, _y);

					let _weaponBlockCollisionPoints: RotateCollisionPoints;
					if (player.inventory.activeItem.type === Weapon.Halberd) _weaponBlockCollisionPoints = this.collisionPoints.halberdBlock;
					if (player.inventory.activeItem.type === Weapon.Sword) _weaponBlockCollisionPoints = this.collisionPoints.swordBlock;
					if (player.inventory.activeItem.type === Weapon.Mace) _weaponBlockCollisionPoints = this.collisionPoints.maceBlock;

					for (const _point of _weaponBlockCollisionPoints.getPointsForAngle(player.inventory.activeItem.getAngle())) {
						const _weaponPoint = new Point(_weaponCenter.x + _point.x, _weaponCenter.y + _point.y);

						if (Math.abs(weaponPoint.x - _weaponPoint.x) <= minGap && Math.abs(weaponPoint.y - _weaponPoint.y) <= minGap) {
							this.block(weaponPoint);
							return;
						}
					}
				}
			}
		}

		let weaponCollisionPoints: RotateCollisionPoints;
		if (this.type === Weapon.Halberd) weaponCollisionPoints = this.collisionPoints.halberd;
		if (this.type === Weapon.Sword) weaponCollisionPoints = this.collisionPoints.sword;
		if (this.type === Weapon.Mace) weaponCollisionPoints = this.collisionPoints.mace;

		for (const point of weaponCollisionPoints.getPointsForAngle(this.getAngle())) {
			const weaponPoint = new Point(weaponCenter.x + point.x, weaponCenter.y + point.y);
			const collisionPoint = new Point(weaponPoint.x, weaponPoint.y);
			for (const round of this.map.roundObstacles) {
				if (!this.hitObjects.includes(round) && round.isActive() && round.isPointIn(collisionPoint)) {
					round.acceptHit(this.power);
					this.hitObjects.push(round);
				}
			}
			for (const rect of this.map.rectangleObstacles) {
				if (!this.hitObjects.includes(rect) && rect.isActive() && rect.isPointIn(collisionPoint)) {
					rect.acceptHit(this.power);
					this.hitObjects.push(rect);
				}
			}
			for (const player of this.players) {
				if (!this.hitObjects.includes(player) && player.isPointIn(collisionPoint)) {
					player.acceptHit(this.power, this.player, this.player.inventory.activeItem.type);
					this.hitObjects.push(player);
				}
			}
		}
	}
}
