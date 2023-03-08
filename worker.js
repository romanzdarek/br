(function loop() {

    const time = new Date();

    if(time.getHours() === 2 || (time.getHours() === 3 && time.getMinutes < 15 )){
        setImmediate(() => {
            loop();
        });
    } else{
        setTimeout(()=>{
            loop();
        }, 1000 * 60)
    }

})();
