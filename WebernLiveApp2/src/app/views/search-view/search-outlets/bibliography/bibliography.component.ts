import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BibliographyService } from '../../services';
import { SearchResponseJson, SubjectItemJson } from '../../../../shared/api-objects';

@Component({
    selector: 'awg-bibliography',
    templateUrl: './bibliography.component.html',
    styleUrls: ['./bibliography.component.css']
})
export class BibliographyComponent implements OnInit {

    public bibListResponse: SearchResponseJson = new SearchResponseJson();
    public bibList: SubjectItemJson[];
    private selectedBibItem: SubjectItemJson;
    private isBibListLoaded: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private bibliographyService: BibliographyService
    ) { }

    ngOnInit() {
        this.getBibList();
    }

    getBibList(): void {
        this.bibliographyService.getBibliographyList()
            .subscribe((data: SearchResponseJson) => {
                this.bibListResponse = {...data};

                // TODO: handle request with more than 1000 entries
                console.info('BibComp#bibListResponse', this.bibListResponse);

                this.bibList = this.bibListResponse.subjects.slice(1, 20);
                    this.isBibListLoaded = true;
                }
            );
    }

    onItemSelect(item: SubjectItemJson): void {
        this.selectedBibItem = item;
    }

    /*
        gotoDetail(id: string): void {
            let link = ['/search', 'bibliography/detail', id];
            this.router.navigate(link);
        }
    */
    /*
     delete(bibItem: BibEntry): void {
     this.bibliographyService
     .delete(bibItem.id)
     .then(() => {
     this.bibList = this.bibList.filter(b => b !== bibItem);
     if (this.selectedBibItem === bibItem) { this.selectedBibItem = null; }
     });
     }
     */
}
