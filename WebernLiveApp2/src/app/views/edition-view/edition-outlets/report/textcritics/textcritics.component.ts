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

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        this.openModalRequest.emit(identifier);
    }

    // TODO: self-sanitize content of comments (loaded from textcritics.json)

}
