import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MetaPage } from '@awg-core/core-models';

/**
 * The FooterDeclaration component.
 *
 * It contains the declaration section of the footer
 * with version number, release date and impressum.
 */
@Component({
    selector: 'awg-footer-declaration',
    templateUrl: './footer-declaration.component.html',
    styleUrls: ['./footer-declaration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class FooterDeclarationComponent {
    /**
     * Input variable: pageMetaData.
     *
     * It keeps the page metadata for the component.
     */
    @Input()
    pageMetaData: MetaPage;

    /**
     * Public getter: changelogUrl.
     *
     * It returns the URL to the changelog file in the GitHub repository
     * based on the app version and GitHub URL from the page metadata.
     */
    get changelogUrl(): string | null {
        if (!this.pageMetaData?.awgAppGithubUrl || !this.pageMetaData?.awgAppVersion) {
            return null;
        }
        return `${this.pageMetaData.awgAppGithubUrl}/blob/v${this.pageMetaData.awgAppVersion}/CHANGELOG.md`;
    }
}
