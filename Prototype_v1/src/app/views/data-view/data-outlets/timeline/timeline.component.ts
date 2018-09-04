import { Component, OnInit } from '@angular/core';

import { TimelineDate } from '@awg-views/data-view/models/timeline-date.model';

@Component({
    selector: 'awg-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

    side: string = '';

    now: Date = new Date();
    date: TimelineDate = new TimelineDate(this.now);

    constructor() { }

    ngOnInit() {
        this.getTodaysEvents();
    }

    getTodaysEvents() {
        console.log('Timeline: called func getTodaysEvents');
    }

}
