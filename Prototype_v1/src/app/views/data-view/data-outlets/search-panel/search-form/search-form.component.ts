import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { AppConfig } from '../../../../../app.config';


@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    @Input() searchValue: string;
    @Output() submitRequest: EventEmitter<any> = new EventEmitter();

    searchForm: FormGroup;
    searchValueControl: AbstractControl;

    apiUrl: string = AppConfig.API_ENDPOINT;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.buildForm(this.searchValue);
    }

    buildForm(searchValue: string) {
        this.searchForm = this.fb.group({
            'searchValue': [searchValue, Validators.compose([
                Validators.required,
                Validators.minLength(3)
            ])]
        });
        this.searchValueControl = this.searchForm.controls['searchValue'];

        // checks for changing values
        this.searchValueControl.valueChanges
            .filter(x => x.length >= 3)
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe((query: string) => {
                this.onSearch(query;
            });
    }


    // submit query to search panel
    onSearch(query: string) {
        this.submitRequest.emit(query);
    }

}
