import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MetaIdentifierBadge, MetaIdentifiers } from '@awg-core/models/meta.model';
import { LOGOS_DATA } from '@awg-shared/logos/logos.data';

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
     * Readonly input signal: identifiers.
     *
     * It holds the authority identifiers of a person.
     */
    readonly identifiers = input.required<MetaIdentifiers | null | undefined>();

    /**
     * Readonly computed signal: displayedBadges.
     *
     * It computes the badges to be displayed based on the given identifiers input and the LOGOS_DATA
     */
    readonly displayedBadges = computed<MetaIdentifierBadge[]>(() => {
        const currentIds = this.identifiers();
        if (!currentIds) {
            return [];
        }
        const validKeys: (keyof MetaIdentifiers)[] = ['gnd', 'viaf', 'orcid'];

        // Filter out invalid or empty keys
        // Map the remaining keys to MetaIdentifierBadge objects
        return validKeys
            .filter(key => !!currentIds[key]?.trim() && !!LOGOS_DATA[key])
            .map(key => {
                const idValue = currentIds[key];
                const logo = LOGOS_DATA[key];
                return {
                    key,
                    fullUrl: logo.href + idValue,
                    src: logo.src,
                    label: logo.alt,
                    titleText: `${key.toUpperCase()}: ${idValue}`,
                };
            });
    });
}
