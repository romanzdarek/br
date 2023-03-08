export default interface PlayerStats {
	kills: number;
	damageTaken: number;
	damageDealt: number;
	survive: number;
	players: number;
	win?: boolean;
	die?: boolean;
}
