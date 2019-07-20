export default class ServerClientSync {
    constructor() {
        this.ping = null;
        this.pings = [];
        this.timeDiference = null;
        this.timeDiferences = [];
        this.attempts = 5;
        this.defaultDrawDelay = 90;
        this.drawDelay = this.defaultDrawDelay;
    }
    getPing() {
        return this.ping;
    }
    getTimeDiference() {
        return this.timeDiference;
    }
    ready() {
        return this.ping != null && this.timeDiference != null;
    }
    reset() {
        this.ping = null;
        this.pings = [];
        this.timeDiference = null;
        this.timeDiferences = [];
    }
    addData(ping, timeDiference) {
        if (!this.ready()) {
            this.pings.push(ping);
            this.timeDiferences.push(timeDiference);
        }
        //count average
        if (this.pings.length === this.attempts) {
            let pingsSuma = 0;
            for (const ping of this.pings) {
                pingsSuma += ping;
            }
            this.ping = pingsSuma / this.attempts;
            let timeDiferenceSuma = 0;
            for (const timeDiference of this.timeDiferences) {
                timeDiferenceSuma += timeDiference;
            }
            this.timeDiference = timeDiferenceSuma / this.attempts;
        }
    }
    changeDrawDelay(change) {
        this.drawDelay += change;
        if (this.drawDelay < 0)
            this.drawDelay = 0;
    }
    getDrawDelay() {
        return this.drawDelay;
    }
    getServerTime() {
        let serverTime = 0;
        if (this.ready()) {
            serverTime = Date.now() + this.getTimeDiference();
        }
        return serverTime;
    }
}
//# sourceMappingURL=ServerClientSync.js.map