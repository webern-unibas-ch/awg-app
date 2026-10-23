import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { EditionComplex } from '@awg-views/edition-view/models/edition-complex.model';
import { EditionComplexesService } from '@awg-views/edition-view/services/edition-complexes.service';
import { EditionStateService } from '@awg-views/edition-view/services/edition-state.service';

/**
 * Resolver: editionComplexResolver.
 *
 * It resolves the edition complex of the route `complex/:complexId`
 * and sets it as selected edition complex in the EditionStateService.
 *
 * The state is updated during the navigation (before the routed components are activated),
 * so that all complex-dependent data is reset before any view reacts to the new complex.
 *
 * @returns {EditionComplex | null} The edition complex for the route param id, otherwise null.
 */
export const editionComplexResolver: ResolveFn<EditionComplex | null> = route => {
    const editionComplexesService = inject(EditionComplexesService);
    const editionStateService = inject(EditionStateService);

    const complexId = route.paramMap.get('complexId') ?? '';
    const complex = complexId ? (editionComplexesService.getEditionComplexById(complexId) ?? null) : null;

    editionStateService.updateSelectedEditionComplex(complex);

    return complex;
};
