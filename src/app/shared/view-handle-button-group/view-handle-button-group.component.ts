import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap/tooltip';

import { ViewHandle, ViewHandleTypes } from './view-handle.model';

/**
 * Number variable: nextGroupId.
 *
 * It keeps the id of the next button group instance
 * (to give each instance a unique radio group name and id prefix).
 */
let nextGroupId = 0;

/**
 * The ViewHandleButtonGroup component.
 *
 * It contains a radio button group
 * to switch between the given view types.
 */
@Component({
    selector: 'awg-view-handle-button-group',
    templateUrl: './view-handle-button-group.component.html',
    styleUrls: ['./view-handle-button-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, NgbTooltip],
})
export class ViewHandleButtonGroupComponent {
    /**
     * Readonly variable: groupName.
     *
     * It keeps the unique name of the radio group of this instance,
     * also used as prefix of the ids of its radio buttons.
     */
    readonly groupName = `awg-view-handle-${nextGroupId++}`;

    /**
     * Readonly input signal: viewHandles.
     *
     * It holds the list of view handles.
     * @default []
     */
    readonly viewHandles = input<ViewHandle[]>([]);

    /**
     * Readonly input signal: selectedViewType.
     *
     * It holds the selected view type.
     */
    readonly selectedViewType = input.required<ViewHandleTypes>();

    /**
     * Readonly output signal: viewChangeRequest.
     *
     * It emits the view type that the user switched to.
     */
    readonly viewChangeRequest = output<ViewHandleTypes>();
}
