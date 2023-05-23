(function loop() {

    const time = new Date();

    if(time.getHours() >= 2 && time.getHours() <= 4){
        setImmediate(() => {
            loop();
        });
    } else{
        setTimeout(()=>{
            loop();
        }, 1000 * 60)
    }

})();
