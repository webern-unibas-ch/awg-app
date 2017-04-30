import { Component, OnInit } from '@angular/core';
import { Meta } from './core/models';
import { MetaService } from './core/services';

@Component({
    selector: 'awg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public metaData: Meta;

    constructor(
        private metaService: MetaService
    ) {}

    ngOnInit() {
        this.provideMetaData();
    }

    public provideMetaData(): void {
            this.metaData = this.metaService.getMetaData();
    }

}
