import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'awg-contact-view',
    templateUrl: './contact-view.component.html',
    styleUrls: ['./contact-view.component.css']
})
export class ContactViewComponent implements OnInit {

    constructor(
        private _route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.scrollTo();
    }

    private scrollTo(id?: string) {
        // TODO - HACK: remove click once https://github.com/angular/angular/issues/6595 is fixed
        setTimeout(() => {
            this._route.fragment
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
