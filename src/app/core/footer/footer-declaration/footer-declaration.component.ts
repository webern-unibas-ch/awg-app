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
     * Computed signal: changelogUrl.
     *
     * It computes the URL to the changelog file in the GitHub repository.
     */
    changelogUrl = computed(() => {
        const meta = this.pageMetaData();

        if (!meta?.awgAppGithubUrl || !meta?.awgAppVersion) {
            return null;
        }
        return `${meta.awgAppGithubUrl}/blob/v${meta.awgAppVersion}/CHANGELOG.md`;
    });
}
