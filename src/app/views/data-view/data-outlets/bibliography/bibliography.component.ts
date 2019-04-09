import { Component, OnInit } from '@angular/core';

import { BibliographyService } from '@awg-views/data-view/services';
import { SearchResponseJson, SubjectItemJson } from '@awg-shared/api-objects';

@Component({
    selector: 'awg-bibliography',
    templateUrl: './bibliography.component.html',
    styleUrls: ['./bibliography.component.css']
})
export class BibliographyComponent implements OnInit {
    bibListResponse: SearchResponseJson = new SearchResponseJson();
    bibList: SubjectItemJson[];
    selectedBibItem: SubjectItemJson;
    isBibListLoaded = false;

    constructor(private bibliographyService: BibliographyService) {}

    ngOnInit() {
        this.getBibList();
    }

    getBibList(): void {
        this.bibliographyService.getBibliographyList().subscribe((data: SearchResponseJson) => {
            this.bibListResponse = { ...data };

            // TODO: handle request with more than 1000 entries
            console.log('BibComp # bibListResponse', this.bibListResponse);

            this.bibList = this.bibListResponse.subjects.slice(1, 20);
            this.isBibListLoaded = true;
        });
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
