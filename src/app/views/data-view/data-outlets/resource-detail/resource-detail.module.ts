import { NgModule } from '@angular/core';
import { SharedModule } from '@awg-shared/shared.module';

import { ResourceDetailHeaderComponent } from './resource-detail-header/resource-detail-header.component';
import { ResourceDetailHtmlComponent } from './resource-detail-html/resource-detail-html.component';
import { ResourceDetailHtmlContentComponent } from './resource-detail-html/resource-detail-html-content/resource-detail-html-content.component';
import { ResourceDetailHtmlContentImageobjectsComponent } from './resource-detail-html/resource-detail-html-content/imageobjects/imageobjects.component';
import { ResourceDetailHtmlContentLinkedobjectsComponent } from './resource-detail-html/resource-detail-html-content/linkedobjects/linkedobjects.component';
import { ResourceDetailHtmlContentPropsComponent } from './resource-detail-html/resource-detail-html-content/props/props.component';
import { ResourceDetailJsonConvertedComponent } from './resource-detail-json-converted/resource-detail-json-converted.component';
import { ResourceDetailJsonRawComponent } from './resource-detail-json-raw/resource-detail-json-raw.component';

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
        ResourceDetailJsonRawComponent
    ],
    exports: [
        ResourceDetailHeaderComponent,
        ResourceDetailHtmlComponent,
        ResourceDetailHtmlContentComponent,
        ResourceDetailHtmlContentImageobjectsComponent,
        ResourceDetailHtmlContentLinkedobjectsComponent,
        ResourceDetailHtmlContentPropsComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent
    ]
})
export class ResourceDetailModule {}
