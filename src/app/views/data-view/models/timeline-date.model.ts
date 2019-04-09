export class TimelineDate {
    day: number;
    month: number;
    findStart: string;
    findEnd: string;

    constructor(now: Date) {
        this.day = now.getDate();
        this.month = now.getMonth() + 1;
    }
}
