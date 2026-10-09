import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { isEmptyObject } from '@awg-shared/utils/object-utils';

import { SourceDesc, SourceDescDetails, SourceDescPhysDesc } from '@awg-views/edition-view/models/source-desc.model';
import { AbbrDirective } from '@awg-views/edition-view/shared/abbr/abbr.directive';
import { CompileHtmlDirective } from '@awg-views/edition-view/shared/compile-html/compile-html.directive';

import { SourceSiglumComponent } from '../../source-siglum/source-siglum.component';
import { SourceDescContentsComponent } from '../source-desc-contents/source-desc-contents.component';
import { SourceDescCorrectionsComponent } from '../source-desc-corrections/source-desc-corrections.component';
import { SourceDescDetailsComponent } from '../source-desc-details/source-desc-details.component';
import { SourceDescWritingInstrumentsComponent } from '../source-desc-writing-instruments/source-desc-writing-instruments.component';
import { SourceDescWritingMaterialsComponent } from '../source-desc-writing-materials/source-desc-writing-materials.component';
import { SOURCE_DESC_DETAILS } from './source-desc-item.data';

/**
 * The SourceDescItem component.
 *
 * It contains a single source description
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-item',
    templateUrl: './source-desc-item.component.html',
    styleUrl: './source-desc-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AbbrDirective,
        CompileHtmlDirective,
        SourceDescContentsComponent,
        SourceDescCorrectionsComponent,
        SourceDescDetailsComponent,
        SourceDescWritingInstrumentsComponent,
        SourceDescWritingMaterialsComponent,
        SourceSiglumComponent,
    ],
})
export class SourceDescItemComponent {
    /**
     * Readonly input signal: sourceDescData.
     *
     * It holds the source description data.
     */
    readonly sourceDescData = input.required<SourceDesc>();

    /**
     * Readonly computed signal: physDesc.
     *
     * It holds the physical description of the source.
     */
    readonly physDesc = computed<SourceDescPhysDesc>(() => this.sourceDescData().physDesc);

    /**
     * Readonly computed signal: hasPhysDesc.
     *
     * It checks whether the source has a non-empty physical description.
     */
    readonly hasPhysDesc = computed<boolean>(() => !isEmptyObject(this.physDesc()));

    /**
     * Readonly computed signal: details.
     *
     * It holds the simple details sections of the physical description
     * that contain details, in the order of their display.
     */
    readonly details = computed<SourceDescDetails[]>(() =>
        SOURCE_DESC_DETAILS.map(detail => ({
            ...detail,
            details: this.physDesc()[detail.key] ?? [],
        })).filter(detail => detail.details.length > 0)
    );
}
