import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * The ViewContainer component.
 *
 * It contains the views section of the app and
 * declares the main outlet that loads the
 * views components and the secondary outlet ('side')
 * that loads the side-info components.
 */
@Component({
    selector: 'awg-view-container',
    templateUrl: './view-container.component.html',
    styleUrls: ['./view-container.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet],
})
export class ViewContainerComponent {
    /**
     * Input signal: activateSideOutlet.
     *
     * It holds a flag to indicate if the side outlet is active.
     */
    activateSideOutlet = input.required<boolean>();
}
