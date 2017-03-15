import { Component, OnInit } from '@angular/core';

import { Meta } from '../../../core/models';
import { MetaService } from '../../../core/meta.service';

@Component({
    selector: 'awg-home-overview',
    templateUrl: './home-overview.component.html',
    styleUrls: ['./home-overview.component.css']
})
export class HomeOverviewComponent implements OnInit {
    public metaData: Meta;

    constructor(private metaService: MetaService) { }

    ngOnInit() {
        this.getMetaData();
    }

    getMetaData(): void {
        this.metaData = this.metaService.getMetaData();
    }

}
