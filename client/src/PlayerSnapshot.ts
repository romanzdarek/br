export default interface PlayerSnapshot {
	readonly x: number;
	readonly y: number;
	//angle
	readonly a: number;
	//hands
	readonly h: HandPackage[];
	//name
	readonly n: string;
};

type HandPackage = { x: number; y: number };
