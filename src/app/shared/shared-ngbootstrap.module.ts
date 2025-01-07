import { NgModule } from '@angular/core';
import {
    NgbAccordionModule,
    NgbAlertModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbModalModule,
    NgbNavModule,
    NgbPaginationModule,
    NgbPopoverModule,
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
        NgbPopoverModule,
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
        NgbPopoverModule,
        NgbToastModule,
        NgbTooltipModule,
        NgbTypeaheadModule,
    ],
})
export class SharedNgbootstrapModule {}
