import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'awg-contact-view',
    templateUrl: './contact-view.component.html',
    styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {

    public contactTitle = 'Impressum';
    public contactId = 'masthead';

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.routeToSidenav();
        this.scrollTo();
    }

    public routeToSidenav(): void {
        this.router.navigate([{ outlets: { side: 'contactInfo' }}]);
    }

    public scrollTo(id?: string) {
        // TODO - HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
        setTimeout(() => {
            this.route.fragment
                .subscribe(
                    f => {
                        if (!f) { return; };
                        const element = document.querySelector('#' + f);
                        if (element) element.scrollIntoView(element);
                    }
                );
        });
    }

}
