import { Component, OnInit } from '@angular/core';
import { Meta } from './core/core-models';
import { MetaService } from './core/services';

@Component({
    selector: 'awg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public meta: Meta;

    constructor(
        private metaService: MetaService
    ) {}

    ngOnInit() {
        this.provideMetaData();
    }

    provideMetaData(): void {
            this.meta = this.metaService.getMetaData();
    }

}
