import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { EditionOutlineSection } from '@awg-views/edition-view/models/edition-outline.model';
import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

/**
 * Resolver: editionSectionResolver.
 *
 * It resolves the edition section of the route `section/:sectionId`
 * and sets it as selected edition section in the EditionStateService.
 *
 * It runs after the {@link editionSeriesResolver} of the parent route (which resets the section),
 * so the route runs this resolver on every navigation (`runGuardsAndResolvers: 'always'`).
 *
 * @returns {EditionOutlineSection | null} The edition section for the route param ids, otherwise null.
 */
export const editionSectionResolver: ResolveFn<EditionOutlineSection | null> = route => {
    const editionOutlineService = inject(EditionOutlineService);
    const editionStateService = inject(EditionStateService);

    const seriesId = route.parent?.paramMap.get('seriesId') ?? '';
    const sectionId = route.paramMap.get('sectionId') ?? '';
    const section =
        seriesId && sectionId ? (editionOutlineService.getEditionSectionById(seriesId, sectionId) ?? null) : null;

    editionStateService.updateSelectedEditionSection(section);

    return section;
};
