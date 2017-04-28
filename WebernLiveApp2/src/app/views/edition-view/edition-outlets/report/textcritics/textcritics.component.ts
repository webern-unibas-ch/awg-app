import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Textcritics } from '../../../textcritics';

@Component({
    selector: 'awg-textcritics',
    templateUrl: './textcritics.component.html',
    styleUrls: ['./textcritics.component.css']
})
export class TextcriticsComponent implements OnInit {
    @Input() comments: Textcritics[];
    @Output() openModalRequest: EventEmitter<any> = new EventEmitter();

    ref: TextcriticsComponent;

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

}
