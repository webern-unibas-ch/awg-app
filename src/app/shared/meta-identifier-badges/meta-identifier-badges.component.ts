import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { LOGOS_DATA } from '@awg-core/core-data';
import { MetaIdentifiers } from '@awg-core/core-models';

/**
 * The MetaIdentifierBadges component.
 *
 * It renders authority identifier badges (GND, VIAF, ORCID) for a given
 * {@link MetaIdentifiers} object and is provided via the {@link SharedModule}.
 */
@Component({
    selector: 'awg-meta-identifier-badges',
    templateUrl: './meta-identifier-badges.component.html',
    styleUrls: ['./meta-identifier-badges.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class MetaIdentifierBadgesComponent {
    /**
     * Input variable: identifiers.
     *
     * It keeps the authority identifiers of a person.
     */
    @Input()
    identifiers: MetaIdentifiers | undefined;

    /**
     * Public readonly variable: IDENTIFIER_CONFIGS.
     *
     * It keeps the configuration for the person authority identifiers.
     */
    readonly IDENTIFIER_CONFIGS = (['gnd', 'viaf', 'orcid'] as (keyof MetaIdentifiers)[]).map(key => ({
        key,
        baseUrl: LOGOS_DATA[key].href,
        src: LOGOS_DATA[key].src,
        label: LOGOS_DATA[key].alt,
    }));
}
