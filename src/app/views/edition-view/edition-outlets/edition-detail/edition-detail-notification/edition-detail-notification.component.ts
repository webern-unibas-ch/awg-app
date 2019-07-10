import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

/**
 * The EditionDetailNotification component.
 *
 * It contains the notification block section
 * of the edition view of the app
 * that displays a hint to the user.
 */
@Component({
    selector: 'awg-edition-detail-notification',
    templateUrl: './edition-detail-notification.component.html',
    styleUrls: ['./edition-detail-notification.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditionDetailNotificationComponent implements OnInit {
    /**
     * Angular life cycle hook: ngOnInit.
     *
     * It calls the containing methods
     * when initializing the component.
     */
    ngOnInit() {}

    // TODO: refactor as awg-helpblock
}
