import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';

/**
 * Guard: editionComplexGuard.
 *
 * It lets the route `complex/:complexId` only match for known edition complexes
 * and redirects unknown complex ids to the 404 page.
 *
 * @returns {true | UrlTree} True if the edition complex exists, otherwise a UrlTree to the 404 page.
 */
export const editionComplexGuard: CanMatchFn = (_route, segments) => {
    const editionComplexesService = inject(EditionComplexesService);
    const router = inject(Router);

    const complexId = segments[1]?.path ?? '';

    return editionComplexesService.getEditionComplexById(complexId) ? true : router.createUrlTree(['/404']);
};
