import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConfig } from '../../../../../app.config';

@Component({
    selector: 'awg-search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
    @Input() searchval: string;
    @Output() submitRequest: EventEmitter<any> = new EventEmitter();

    url: string = AppConfig.API_ENDPOINT;

    searchForm: FormGroup;
    searchValueControl: AbstractControl;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.buildForm(this.searchval);
    }

    buildForm(searchval: string) {
        this.searchForm = this.fb.group({
            'searchValue': [searchval, Validators.compose([
                Validators.required,
                Validators.minLength(3)
            ])]
        });
       this.searchValueControl = this.searchForm.controls['searchValue'];

        console.log('searchForm# searchValueControl.value: ', this.searchValueControl.value);

        /* TODO: rm
        this.searchValueControl.valueChanges
            .subscribe((value: string) => console.log('searchValueControl changed: ', value));

        this.searchForm.valueChanges.subscribe(
            (form: any) => {
                console.log('form changed to:', form);
            }
        );
        */

    }

    private onSubmit(value: string) {
        this.submitRequest.emit(value);
    }

}
