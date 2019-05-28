export default interface Socket {
	on(
		event: string,
		callback: (
			data0: any,
			data1?: any,
			data2?: any,
			data3?: any,
			data4?: any,
			data5?: any,
			data6?: any,
			data7?: any,
			data8?: any,
			data9?: any
		) => void
	): void;
	emit(
		event: string,
		data0: any,
		data1?: any,
		data2?: any,
		data3?: any,
		data4?: any,
		data5?: any,
		data6?: any,
		data7?: any,
		data8?: any,
		data9?: any
	): void;
};
