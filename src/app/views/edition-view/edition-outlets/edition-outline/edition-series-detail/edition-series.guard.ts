import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

/**
 * Guard: editionSeriesGuard.
 *
 * It lets the route `series/:seriesId` only match for known edition series
 * and redirects unknown series ids to the 404 page.
 *
 * @returns {true | UrlTree} True if the edition series exists, otherwise a UrlTree to the 404 page.
 */
export const editionSeriesGuard: CanMatchFn = (_route, segments) => {
    const editionOutlineService = inject(EditionOutlineService);
    const router = inject(Router);

    const seriesId = segments[1]?.path ?? '';

    return editionOutlineService.getEditionSeriesById(seriesId) ? true : router.createUrlTree(['/404']);
};
