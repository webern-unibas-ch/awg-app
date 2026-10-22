import { Component, input } from '@angular/core';

import { SourceDescWritingMaterial } from '@awg-views/edition-view/models/source-desc.model';

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
    styleUrl: './source-desc-writing-materials.component.scss',
    imports: [SourceDescWritingMaterialComponent],
})
export class SourceDescWritingMaterialsComponent {
    /**
     * Readonly input signal: writingMaterials.
     *
     * It holds the writing materials array.
     */
    readonly writingMaterials = input.required<SourceDescWritingMaterial[]>();
}
