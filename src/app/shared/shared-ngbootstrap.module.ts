import { NgModule } from '@angular/core';
import {
    NgbAccordionModule,
    NgbAlertModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbToastModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NgbAccordionModule,
        NgbAlertModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbToastModule,
        NgbTooltipModule,
        NgbTypeaheadModule,
    ],
    exports: [
        NgbAccordionModule,
        NgbAlertModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbModalModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbToastModule,
        NgbTooltipModule,
        NgbTypeaheadModule,
    ],
})
export class SharedNgbootstrapModule {}
