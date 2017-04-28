import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Source } from '../../../../source';

@Component({
    selector: 'awg-source-list',
    templateUrl: './source-list.component.html',
    styleUrls: ['./source-list.component.css']
})
export class SourceListComponent implements OnInit {
    @Input() sourceList: Source[];
    @Output() openModalRequest: EventEmitter<string> = new EventEmitter();
    @Output() scrollRequest: EventEmitter<any> = new EventEmitter();

    ref: SourceListComponent;

    constructor() { }

    ngOnInit() {
    }

    openModal(identifier: string) {
        console.log('emit');
        this.openModalRequest.emit(identifier);
    }

    scrollTo(id: string) {
        this.scrollRequest.emit(id);
    }

}
