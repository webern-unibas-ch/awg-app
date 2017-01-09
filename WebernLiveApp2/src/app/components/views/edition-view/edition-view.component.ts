import { Component, OnInit } from '@angular/core';

import { EditionService } from './edition.service';

@Component({
    selector: 'awg-edition-view',
    templateUrl: './edition-view.component.html',
    styleUrls: ['./edition-view.component.css'],
    providers: [ EditionService ],
})
export class EditionViewComponent implements OnInit {

    public editionTitle: string = '<em>Vier Lieder</em> op. 12, Skizzen';
    public tkaData;
    private errorMessage: string = undefined;

    // init sheets
    sheet2: string ="Aa:SkI/2";
    sheet3: string ="Aa:SkI/3";
    sheet4: string ="Aa:SkI/4";
    sheet5: string ="Aa:SkI/5";
    sheet: string = this.sheet2;

    // TODO
    showTkA: boolean = true;
    items: string[] = [
        this.sheet2,
        this.sheet3,
        this.sheet4,
        this.sheet5
    ]

    // check for routeParams
    /* TODO
    if ($routeParams.id) {
        this.sheet = $routeParams.id;
    };
    */

    public sheets: Object[] = [
        {
            "Aa:SkI/2": {
                "svg": "img/SkI_2n_small_cut_opt.svg",
                "image": "img/SkI_2n_small.jpg",
                "alt": "Aa:SkI/2"
            }
        },
        {
            "Aa:SkI/3": {
                "svg": "img/SkI_3n_small_cut_opt.svg",
                "image": "img/SkI_3n_small.jpg",
                "alt": "Aa:SkI/3"
            }
        },
        {
            "Aa:SkI/4": {
                "svg": "img/SkI_4n_small_cut_opt.svg",
                "image": "img/SkI_4n_small.jpg",
                "alt": "Aa:SkI/4"
            }
        },
        {
            "Aa:SkI/5": {
                "svg": "img/SkI_5n_small_cut_opt.svg",
                "image": "img/SkI_5n_small.jpg",
                "alt": "Aa:SkI/5"
            }
        }
    ];

    constructor(private _editionService: EditionService) { }

    ngOnInit() {
        this._editionService.getTkaData()
            .subscribe(
                data => {
                    this.tkaData = data;
                    this.showTkA = false;

                    console.log('tka: ', this.tkaData);
                },
                error => {
                    this.errorMessage = <any>error;
                }
            );
    }

}
