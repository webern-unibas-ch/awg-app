import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MetaPage } from '@awg-core/core-models';

/**
 * The FooterDeclaration component.
 *
 * It contains the declaration section of the footer
 * with version number, release date and imprint.
 */
@Component({
    selector: 'awg-footer-declaration',
    templateUrl: './footer-declaration.component.html',
    styleUrls: ['./footer-declaration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, RouterLink],
})
export class FooterDeclarationComponent {
    /**
     * Input signal: pageMetaData.
     *
     * It holds the page metadata for the footer declaration.
     */
    pageMetaData = input.required<MetaPage>();

    /**
     * Computed signal: versionData.
     *
     * It computes the relevant pageMetaData for the footer declaration.
     */
    versionData = computed(() => {
        const page = this.pageMetaData();

        if (!page?.awgAppGithubUrl || !page?.awgAppVersion || !page?.awgAppVersionReleaseDate) {
            return null;
        }

        const url = `${page.awgAppGithubUrl}/blob/v${page.awgAppVersion}/CHANGELOG.md`;

        return {
            url,
            version: page.awgAppVersion,
            versionDate: page.awgAppVersionReleaseDate,
        };
    });
}
