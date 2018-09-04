import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MetaService } from '../../core/services/meta-service';
import { Meta } from '../../core/core-models';

@Component({
    selector: 'awg-contact-view',
    templateUrl: './contact-view.component.html',
    styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {

    public contactTitle = 'Impressum';
    public contactId = 'masthead';

    public dateFormat: string = 'd. MMMM yyyy';
    public meta: Meta;
    public today: number;


    constructor(
        private metaService: MetaService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.provideMetaData();
        this.routeToSidenav();
        this.scrollTo();
        this.today = Date.now();
    }

    public provideMetaData(): void {
        this.meta = this.metaService.getMetaData();
    }

    public routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'contactInfo' }}]);
    }

    public scrollTo(id?: string) {
        // TODO - HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
        setTimeout(() => {
            this.route.fragment.subscribe(f => {
                        if (!f) { return; }
                        const element = document.querySelector('#' + f);
                        if (element) { element.scrollIntoView(); }
                    }
                );
        });
    }

}
