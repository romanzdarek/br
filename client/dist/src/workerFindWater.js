onmessage = function (e) {
    const data = e.data.data;
    const size = e.data.size;
    const type = e.data.type;
    const time = e.data.time;
    //rgbx - 0123 0123 0123
    //choose only one color data
    const oneColorFromImage = [];
    for (let i = 0; i < data.length; i += 4) {
        oneColorFromImage.push(data[i]);
    }
    //create 2 dimensionally Array (format: column, column, column...)
    const twoDimensionallyArr = [];
    for (let i = 0; i < size; i++) {
        twoDimensionallyArr.push(oneColorFromImage.slice(i * size, i * size + size));
    }
    //transform row to column
    //save if color == water
    //where is water? 255 == white (transparent color == green terrain)
    const finalArr = [];
    for (let x = 0; x < size; x++) {
        finalArr[x] = [];
        for (let y = 0; y < size; y++) {
            if (twoDimensionallyArr[y][x] === 255) {
                finalArr[x][y] = false;
            }
            else {
                finalArr[x][y] = true;
            }
        }
    }
    //@ts-ignore
    postMessage({ type: type, time: time, data: finalArr });
};
//# sourceMappingURL=workerFindWater.js.map