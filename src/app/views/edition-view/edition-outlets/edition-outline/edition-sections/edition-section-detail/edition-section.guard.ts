import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { EditionOutlineService } from '@awg-views/edition-view/services/edition-outline.service';

/**
 * Guard: editionSectionGuard.
 *
 * It lets the route `section/:sectionId` only activate for known sections of the given edition series
 * and redirects unknown section ids to the 404 page.
 *
 * It is a CanActivate guard (and not a CanMatch guard), because the series id of the parent route
 * is not available for matching inside the lazy loaded series routes.
 *
 * @returns {true | UrlTree} True if the edition section exists, otherwise a UrlTree to the 404 page.
 */
export const editionSectionGuard: CanActivateFn = route => {
    const editionOutlineService = inject(EditionOutlineService);
    const router = inject(Router);

    const seriesId = route.parent?.paramMap.get('seriesId') ?? '';
    const sectionId = route.paramMap.get('sectionId') ?? '';

    return editionOutlineService.getEditionSectionById(seriesId, sectionId) ? true : router.createUrlTree(['/404']);
};
