import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'awg-alert-info',
    templateUrl: './alert-info.component.html',
    styleUrls: ['./alert-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertInfoComponent {
    /**
     * Input variable: infoMessage.
     *
     * It keeps the info message for the component.
     */
    @Input()
    infoMessage: string;

    /**
     * Public variable: faCircleInfo.
     *
     * It instantiates fontawesome's faCircleInfo icon.
     */
    faCircleInfo = faCircleInfo;

    /**
     * Input variable: isOpen.
     *
     * It keeps the open state for the component.
     */
    isOpen = true;

    /**
     * Public variable: type.
     *
     * It keeps the type for the component.
     */
    type = 'info';
}
