import { NgModule } from '@angular/core';
import {
    NgbAccordionModule,
    NgbButtonsModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NgbAccordionModule,
        NgbButtonsModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbTooltipModule
    ],
    exports: [
        NgbAccordionModule,
        NgbButtonsModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbTooltipModule
    ]
})
export class SharedNgbootstrapModule {}
