import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    @Input() searchval: string;
    @Output() submitRequest: EventEmitter<any> = new EventEmitter();

    private url: string = 'http://www.salsah.org';

    constructor() { }

    ngOnInit() {
    }

    private onSubmit(val: string) {
        this.submitRequest.emit(val);
    }

}
