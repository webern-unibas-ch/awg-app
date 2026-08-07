import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';

import { ModalService } from '@awg-shared/modal/modal.service';
import { UTILS } from '@awg-shared/utils/object-utils';

import { Source, SourceList } from '@awg-views/edition-view/models/source-list.model';
import {
    EditionNavigationService,
    FragmentClickEvent,
} from '@awg-views/edition-view/services/edition-navigation.service';

/**
 * The SourceList component.
 *
 * It contains the source list section
 * of the criitical report
 * of the edition view of the app.
 */
@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SourceListComponent {
    /**
     * Private readonly injection variable: _navigationService
     *
     * It keeps the instance of the injected EditionNavigationService.
     */
    private readonly _navigationService = inject(EditionNavigationService);

    /**
     * Private readonly injection variable: _modalService
     *
     * It keeps the instance of the injected ModalService.
     */
    private readonly _modalService = inject(ModalService);

    /**
     * Input variable: sourceListData.
     *
     * It keeps the source list data.
     */
    @Input()
    sourceListData: SourceList;

    /**
     * Protected readonly variable: UTILS.
     *
     * It keeps the reference to the {@link UTILS} methods.
     */
    protected readonly UTILS = UTILS;

    /**
     * Public method: onSourceClick.
     *
     * It navigates to a report fragment or opens a modal
     * on a source click event.
     *
     * @param {Source} source The given source.
     *
     * @returns {void} Navigates to a report fragment or opens a modal.
     */
    onSourceClick(source: Source): void {
        if (source.hasDescription) {
            this._navigateToReportFragment({
                complexId: '',
                fragmentId: source.linkTo,
            });
        } else {
            this._openModal(source.linkTo);
        }
    }

    /**
     * Private method: navigateToReportFragment.
     *
     * It delegates the navigation for the given complex and report fragment IDs
     * directly to the {@link EditionNavigationService}.
     *
     * @param {object} reportIds The given report ids as FragmentClickEvent.
     * @returns {void} Navigates to the selected report fragment.
     */
    _navigateToReportFragment(reportIds: FragmentClickEvent): void {
        if (!reportIds?.fragmentId) {
            return;
        }
        this._navigationService.navigateToReportFragment(reportIds);
    }

    /**
     * Private method: openModal.
     *
     * It opens a text modal snippet via the {@link ModalService} for a given id.
     *
     * @param {string} id The given modal snippet id.
     * @returns {void} Opens the text modal.
     */
    private _openModal(id: string): void {
        if (!id) {
            return;
        }
        this._modalService.openTextModal(id);
    }
}
