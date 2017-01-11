import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap';

import { MapToIterablePipe } from './map-to-iterable/map-to-iterable.pipe';
import { ModalComponent } from './modal/modal.component';

@NgModule({
    imports: [ CommonModule, FormsModule, ModalModule ],
    declarations: [
        MapToIterablePipe,
        ModalComponent
    ],
    exports: [
        CommonModule, FormsModule, ModalModule,
        MapToIterablePipe,
        ModalComponent
    ]
})
export class SharedModule { }
