import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

    side: string = '';

    now: Date = new Date();
    date: Object = {
        day: this.now.getDate(),
        month: this.now.getMonth() + 1,
        findStart: '',
        findEnd: ''
    };

    constructor() { }

    ngOnInit() {
        this.getTodaysEvents();
    }

    getTodaysEvents() {
        console.log('Timeline: called func getTodaysEvents');
    }

}
