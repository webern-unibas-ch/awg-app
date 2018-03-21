import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ResourceDetailHtmlComponent } from './resource-detail-html/resource-detail-html.component';
import { ResourceDetailHtmlContentComponent } from './resource-detail-html/resource-detail-html-content/resource-detail-html-content.component';
import { ResourceDetailHtmlContentImageobjectsComponent } from './resource-detail-html/resource-detail-html-content/imageobjects/imageobjects.component';
import { ResourceDetailHtmlContentLinkedobjectsComponent } from './resource-detail-html/resource-detail-html-content/linkedobjects/linkedobjects.component';
import { ResourceDetailHtmlContentPropsComponent } from './resource-detail-html/resource-detail-html-content/props/props.component';
import { ResourceDetailHtmlHeaderComponent } from './resource-detail-html/resource-detail-html-header/resource-detail-html-header.component';
import { ResourceDetailJsonConvertedComponent } from './resource-detail-json-converted/resource-detail-json-converted.component';
import { ResourceDetailJsonRawComponent } from './resource-detail-json-raw/resource-detail-json-raw.component';


@NgModule({
    imports: [
        SharedModule
    ],
    declarations: [
        ResourceDetailHtmlComponent,
        ResourceDetailHtmlContentComponent,
        ResourceDetailHtmlContentImageobjectsComponent,
        ResourceDetailHtmlContentLinkedobjectsComponent,
        ResourceDetailHtmlContentPropsComponent,
        ResourceDetailHtmlHeaderComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent
    ],
    exports: [
        ResourceDetailHtmlComponent,
        ResourceDetailHtmlContentComponent,
        ResourceDetailHtmlContentImageobjectsComponent,
        ResourceDetailHtmlContentLinkedobjectsComponent,
        ResourceDetailHtmlContentPropsComponent,
        ResourceDetailHtmlHeaderComponent,
        ResourceDetailJsonConvertedComponent,
        ResourceDetailJsonRawComponent
    ]
})
export class ResourceDetailModule { }
