import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FolioFormatOptions} from '@awg-views/edition-view/models';

@Component({
    selector: 'awg-edition-folio-form',
    templateUrl: './folio-form.component.html',
    styleUrls: ['./folio-form.component.css']
})
export class FolioFormComponent implements OnInit {
    @Input() folioFormatOptions: FolioFormatOptions;
    @Output() resetRequest: EventEmitter<any> = new EventEmitter<any>();
    @Output() submitRequest: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }

    ngOnInit() {
    }

    onReset(): void {
        this.resetRequest.emit();
    }

    onSubmit(): void {
        this.submitRequest.emit();
    }

}
