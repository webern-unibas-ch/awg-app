import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { distinctUntilChanged, debounceTime, filter } from 'rxjs/operators';

@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    @Input()
    searchValue: string;
    @Output()
    submitRequest: EventEmitter<string> = new EventEmitter();

    searchForm: FormGroup;
    searchValueControl: AbstractControl = new FormControl();

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.buildForm(this.searchValue);
    }

    buildForm(searchValue: string) {
        this.searchForm = this.fb.group({
            searchValueControl: [searchValue || '', Validators.compose([Validators.required, Validators.minLength(3)])]
        });

        console.log('searchform', this.searchForm);
        // this.searchValueControl.setValue(searchValue);

        console.log('searchValueControl', this.searchValueControl);

        // checks for changing values
        this.searchValueControl.valueChanges
            .pipe(
                filter(x => x.length >= 3),
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((query: string) => {
                this.onSearch(query);
            });
    }

    // submit query to search panel
    onSearch(query: string) {
        this.submitRequest.emit(query);
    }
}
