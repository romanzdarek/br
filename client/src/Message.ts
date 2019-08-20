export default class Message{
    readonly text: string;
    readonly time: number;

    constructor(time: number, text: string){
        this.time = time;
        this.text = text;
    }
}