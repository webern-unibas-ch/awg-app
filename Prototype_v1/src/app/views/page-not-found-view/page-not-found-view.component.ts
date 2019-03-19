import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-page-not-found-view',
    templateUrl: './page-not-found-view.component.html',
    styleUrls: ['./page-not-found-view.component.css']
})
export class PageNotFoundViewComponent implements OnInit {
    title = 'Entschuldigung, diese Seite gibt es hier nicht…';
    subtitle = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';

    private _imgPath = 'assets/img/page-not-found/Webern_Books.jpg';
    private _awgUrl = 'http://www.anton-webern.ch/index.php?id=41';

    get imgPath(): string {
        return this._imgPath;
    }

    get awgUrl(): string {
        return this._awgUrl;
    }

    constructor() {}

    ngOnInit() {}
}
