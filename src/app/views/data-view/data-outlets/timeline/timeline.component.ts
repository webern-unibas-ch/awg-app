import { Component, OnInit } from '@angular/core';

import { TimelineDate } from '@awg-views/data-view/models/timeline-date.model';

/**
 * The Timeline component.
 *
 * It contains the timeline section
 * of the data view of the app
 * that displays a timeline of chronology events
 * of the current date.
 */
@Component({
    selector: 'awg-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
    /**
     * Public variable: side.
     *
     * It sets the side position of the timeline.
     */
    side = '';

    /**
     * Public variable: today.
     *
     * It keeps the current date for the timeline.
     */
    today: Date = new Date();

    /**
     * Public variable: date.
     *
     * It keeps the current date data for the timeline.
     */
    date: TimelineDate = new TimelineDate(this.today);

    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {
        this.getTodaysEvents();
    }

    /**
     * Public method: getTodaysEvents.
     *
     * It calls the given (SALSAH) API to get the chronology events
     * of the current date.
     *
     * NOT USED.
     *
     * IMPLEMENTATION FOR FUTURE USE.
     *
     * @returns {void} TODO
     */
    getTodaysEvents(): void {
        // console.log('Timeline: called func getTodaysEvents');
    }
}
