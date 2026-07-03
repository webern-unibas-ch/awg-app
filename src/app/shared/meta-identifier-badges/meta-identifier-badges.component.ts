import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { MetaIdentifierBadge, MetaIdentifiers } from '@awg-core/models/meta.model';
import { CoreService } from '@awg-core/services/core-service/core.service';

/**
 * The MetaIdentifierBadges component.
 *
 * It renders authority identifier badges (GND, VIAF, ORCID) for a given
 * {@link MetaIdentifiers} object.
 */
@Component({
    selector: 'awg-meta-identifier-badges',
    templateUrl: './meta-identifier-badges.component.html',
    styleUrls: ['./meta-identifier-badges.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetaIdentifierBadgesComponent {
    /**
     * Private readonly injection variable: _coreService.
     *
     * It keeps the instance of the injected CoreService.
     */
    private readonly _coreService = inject(CoreService);

    /**
     * Readonly input signal: identifiers.
     *
     * It holds the authority identifiers of a person.
     */
    readonly identifiers = input.required<MetaIdentifiers>();

    /**
     * Readonly computed signal: displayedBadges.
     *
     * It computes the badges to be displayed based on the given identifiers input and the LOGOS_DATA
     */
    readonly displayedBadges = computed<MetaIdentifierBadge[]>(() => {
        const currentIds = this.identifiers();
        const logosData = this._coreService.getLogos();

        return (['gnd', 'viaf', 'orcid'] as (keyof MetaIdentifiers)[])
            .filter(key => currentIds[key])
            .map(key => {
                const idValue = currentIds[key];
                return {
                    key,
                    fullUrl: logosData[key].href + idValue,
                    src: logosData[key].src,
                    label: logosData[key].alt,
                    titleText: `${key.toUpperCase()}: ${idValue}`,
                };
            });
    });
}
