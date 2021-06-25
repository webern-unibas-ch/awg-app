import { NgModule } from '@angular/core';
import {
    NgbAccordionModule,
    NgbButtonsModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbToastModule,
    NgbTooltipModule,
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
        NgbToastModule,
        NgbTooltipModule,
    ],
    exports: [
        NgbAccordionModule,
        NgbButtonsModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbToastModule,
        NgbTooltipModule,
    ],
})
export class SharedNgbootstrapModule {}
