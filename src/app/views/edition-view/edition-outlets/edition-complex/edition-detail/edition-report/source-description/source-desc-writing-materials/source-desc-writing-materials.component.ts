import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { SourceDescriptionWritingMaterial } from '@awg-views/edition-view/models/source-description.model';

import { SourceDescWritingMaterialComponent } from './material/source-desc-writing-material.component';

/**
 * The SourceDescWritingMaterials component.
 *
 * It contains the source description writing materials section
 * of the critical report of the edition view of the app.
 */
@Component({
    selector: 'awg-source-desc-writing-materials',
    templateUrl: './source-desc-writing-materials.component.html',
    styleUrls: ['./source-desc-writing-materials.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SourceDescWritingMaterialComponent],
})
export class SourceDescWritingMaterialsComponent {
    /**
     * Readonly input signal: writingMaterials.
     *
     * It holds the writing materials array.
     */
    readonly writingMaterials = input.required<SourceDescriptionWritingMaterial[]>();
}
