import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportComponent } from './report.component';

const reportRoutes: Routes = [
    { path: '', component: ReportComponent }
]

@NgModule({
    imports: [ RouterModule.forChild(reportRoutes) ],
    exports: [ RouterModule ]
})
export class ReportRoutingModule { }

export const routedReportComponents = [
    ReportComponent
];
