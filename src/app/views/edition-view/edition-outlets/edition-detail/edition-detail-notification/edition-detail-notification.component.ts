import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-edition-detail-notification',
    templateUrl: './edition-detail-notification.component.html',
    styleUrls: ['./edition-detail-notification.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionDetailNotificationComponent implements OnInit {
    constructor() {}

    ngOnInit() {}

    // TODO: refactor as awg-helpblock
}
