import Model from './model';

export type Keys = {
	w: boolean;
	a: boolean;
	s: boolean;
	d: boolean;
};

export type Mouse = {
	x: number;
	y: number;
	left: boolean;
	middle: boolean;
	right: boolean;
};

export class Controller {
	private static instance: Controller;
	private model: Model;
	private keys: Keys = {
		w: false,
		a: false,
		s: false,
		d: false
	};
	private mouse: Mouse = {
		x: 0,
		y: 0,
		left: false,
		middle: false,
		right: false
	};

	private constructor() {
		this.model = new Model(this.keys, this.mouse);
		this.model.screenResize();
		window.addEventListener('resize', () => {
			this.model.screenResize();
		});
		this.keysController();
		this.mouseController();
	}

	static run(): void {
		if (!Controller.instance) {
			Controller.instance = new Controller();
		}
		else {
			throw new Error('Only one controller!');
		}
	}

	private mouseController(): void {
		const canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0];
		canvas.addEventListener('mousemove', (e: MouseEvent) => {
			this.mouse.x = e.x;
			this.mouse.y = e.y;
		});
		canvas.addEventListener('click', (e: MouseEvent) => {
			this.mouse.left = true;
		});
	}

	private keysController(): void {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					this.keys.w = true;
					break;
				case 'KeyA':
					this.keys.a = true;
					break;
				case 'KeyS':
					this.keys.s = true;
					break;
				case 'KeyD':
					this.keys.d = true;
					break;
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			switch (e.code) {
				case 'KeyW':
					this.keys.w = false;
					break;
				case 'KeyA':
					this.keys.a = false;
					break;
				case 'KeyS':
					this.keys.s = false;
					break;
				case 'KeyD':
					this.keys.d = false;
					break;
			}
		});
	}
}
