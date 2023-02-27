import { Player } from './Player';
import { Weapon } from './Weapon';
import Smoke from './Smoke';

export default class SmokeCloud {
	private x: number;
	private y: number;
	private shiftX: number;
	private shiftY: number;
	private size: number;
	private opacity: number;
	private angle: number;
	private steps: number = 1200;
	private step: number = 0;
	private owner: Player;

	constructor(smoke: Smoke, angle: number) {
		this.owner = smoke.player;
		const cloudSpeed = 0.1;
		const cloudSpray = 20;
		this.x = smoke.getX();
		this.y = smoke.getY();
		this.size = 50;
		this.opacity = 0;
		//random change angle
		let randomchange = Math.round(Math.random() * cloudSpray * 100) / 100;
		let randomDirection = Math.round(Math.random());
		if (!randomDirection) randomDirection = -1;
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

	hitPlayer(player: Player) {
		const damage = 0.1;

		const xDistance = Math.abs(player.getCenterX() - this.x);
		const yDistance = Math.abs(player.getCenterY() - this.y);
		const centerPlayerToCenterCloud = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

		if (centerPlayerToCenterCloud < Player.radius + this.size / 2) {
			player.acceptHit(damage, this.owner, Weapon.Smoke);
		}
	}

	move(): void {
		const opacityIncrease = (1 / this.steps) * 2;
		if (this.step < this.steps / 2) {
			this.opacity += opacityIncrease;
		} else {
			this.opacity -= opacityIncrease;
			if (this.opacity < 0) this.opacity = 0;
		}
		this.x += this.shiftX;
		this.y += this.shiftY;
		this.size += 0.5;
		this.step++;
	}

	isActive(): boolean {
		return this.step < this.steps;
	}

	getX(): number {
		return this.x;
	}

	getY(): number {
		return this.y;
	}

	getSize(): number {
		return this.size;
	}

	getOpacity(): number {
		return this.opacity;
	}
}
