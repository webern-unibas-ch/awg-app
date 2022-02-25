import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { ResourceDetailHeaderComponent } from './resource-detail-header';
import { ResourceDetailHtmlComponent } from './resource-detail-html';
import { ResourceDetailHtmlContentComponent } from './resource-detail-html/resource-detail-html-content';
import { ResourceDetailHtmlContentImageobjectsComponent } from './resource-detail-html/resource-detail-html-content/imageobjects';
import { ResourceDetailHtmlContentLinkedobjectsComponent } from './resource-detail-html/resource-detail-html-content/linkedobjects';
import { ResourceDetailHtmlContentPropsComponent } from './resource-detail-html/resource-detail-html-content/props';
import { ResourceDetailJsonConvertedComponent } from './resource-detail-json-converted';
import { ResourceDetailJsonRawComponent } from './resource-detail-json-raw';

/**
 * The resource detail module.
 *
 * It embeds the resource detail components
 * as well as the {@link SharedModule}.
 */
@NgModule({
    imports: [SharedModule],
    declarations: [
        ResourceDetailHeaderComponent,
        ResourceDetailHtmlComponent,
        ResourceDetailHtmlContentComponent,
        ResourceDetailHtmlContentImageobjectsComponent,
        ResourceDetailHtmlContentLinkedobjectsComponent,
        ResourceDetailHtmlContentPropsComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent,
    ],
    exports: [
        ResourceDetailHeaderComponent,
        ResourceDetailHtmlComponent,
        ResourceDetailHtmlContentComponent,
        ResourceDetailHtmlContentImageobjectsComponent,
        ResourceDetailHtmlContentLinkedobjectsComponent,
        ResourceDetailHtmlContentPropsComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent,
    ],
})
export class ResourceDetailModule {}
