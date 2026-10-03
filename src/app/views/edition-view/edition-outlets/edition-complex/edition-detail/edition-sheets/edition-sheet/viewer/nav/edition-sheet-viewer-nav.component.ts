import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * The EditionSheetViewerNav component.
 *
 * It contains the navigation panel for the edition svg sheet viewer.
 */
@Component({
    selector: 'awg-edition-sheet-viewer-nav',
    templateUrl: './edition-sheet-viewer-nav.component.html',
    styleUrls: ['./edition-sheet-viewer-nav.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditionSheetViewerNavComponent {
    /**
     * Readonly output signal: browseRequest.
     *
     * It emits the direction to browse to the previous (-1) or next (1) svg sheet.
     */
    readonly browseRequest = output<1 | -1>();
}
