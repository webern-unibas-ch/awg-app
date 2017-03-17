import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-search-fulltext-form',
    templateUrl: './search-fulltext-form.component.html',
    styleUrls: ['./search-fulltext-form.component.css']
})
export class SearchFulltextFormComponent implements OnInit {
    @Input() searchValue: string;
    @Output() submitRequest: EventEmitter<any> = new EventEmitter();

    private url: string = 'http://www.salsah.org';

    constructor() { }

    ngOnInit() {
    }

    private onSubmit(val: string) {
        this.submitRequest.emit(val);
    }

}
