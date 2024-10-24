import { NgModule } from '@angular/core';
import {
    NgbAccordionModule,
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
