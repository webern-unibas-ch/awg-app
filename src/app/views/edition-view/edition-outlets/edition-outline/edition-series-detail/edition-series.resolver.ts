import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { EditionOutlineSeries } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

/**
 * Resolver: editionSeriesResolver.
 *
 * It resolves the edition series of the route `series/:seriesId`
 * and sets it as selected edition series in the EditionStateService
 * (which also resets the selected edition complex and section).
 *
 * The route runs this resolver on every navigation (`runGuardsAndResolvers: 'always'`),
 * so that a previously selected section is reset when navigating within the series.
 * The section is set again afterwards by the {@link editionSectionResolver} of a child route.
 *
 * @returns {EditionOutlineSeries | null} The edition series for the route param id, otherwise null.
 */
export const editionSeriesResolver: ResolveFn<EditionOutlineSeries | null> = route => {
    const editionOutlineService = inject(EditionOutlineService);
    const editionStateService = inject(EditionStateService);

    const seriesId = route.paramMap.get('seriesId') ?? '';
    const series = seriesId ? (editionOutlineService.getEditionSeriesById(seriesId) ?? null) : null;

    editionStateService.updateSelectedEditionSeries(series);

    return series;
};
