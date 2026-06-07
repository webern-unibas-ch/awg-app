import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { EditionOutlineService } from '@awg-views/edition-view/services';
import { EditionStatistics, StatisticsProgressBarItem } from '@awg-views/statistics-view/models';
import { EditionStatisticsService } from '@awg-views/statistics-view/services';

/**
 * The Statistics view component.
 *
 * It contains the statistics view section of the app
 * with a statistics page about the edition complexes.
 */
@Component({
    selector: 'awg-statistics-view',
    templateUrl: './statistics-view.component.html',
    styleUrls: ['./statistics-view.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class StatisticsViewComponent {
    /**
     * Private readonly injection variable: _editionStatisticsService.
     *
     * It keeps the instance of the injected EditionStatisticsService.
     */
    protected readonly _editionStatisticsService = inject(EditionStatisticsService);

    /**
     * Public readonly variable: complexBreakdownItems.
     *
     * It defines the items for the complex breakdown progress bars.
     */
    readonly complexBreakdownItems: StatisticsProgressBarItem[] = [
        { key: 'opus', baseLabel: 'Opus', colorClass: 'bg-primary' },
        { key: 'mnr', baseLabel: 'M-number', colorClass: 'bg-secondary' },
        { key: 'mnrX', baseLabel: 'M*-number', colorClass: 'bg-info' },
    ];

    /**
     * Public readonly signal: statisticsData.
     *
     * It holds the statistics data for the edition complexes.
     */
    readonly statisticsData = signal<EditionStatistics>(
        this._editionStatisticsService.getStatisticsFromOutline(EditionOutlineService.getEditionOutline())
    );
}
