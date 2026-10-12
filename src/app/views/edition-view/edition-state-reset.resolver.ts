import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { EditionStateService } from './services/edition-state.service';

/**
 * Resolver: editionStateResetResolver.
 *
 * It resets the selected edition complex, series and section in the EditionStateService
 * for edition routes that do not belong to a specific complex, series or section
 * (e.g. preface, row tables, series overview).
 *
 * The state is reset during the navigation (before the routed components are activated),
 * analogous to the resolvers that set the state for complexes, series and sections.
 *
 * @returns {null} Nothing to resolve.
 */
export const editionStateResetResolver: ResolveFn<null> = () => {
    // Resetting the complex also resets the manually selected series and section
    inject(EditionStateService).updateSelectedEditionComplex(null);

    return null;
};
