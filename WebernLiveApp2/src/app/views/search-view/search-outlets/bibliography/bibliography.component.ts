import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BibliographyService } from './bibliography.service';
import { SearchResponseJson, SubjectItemJson } from '../../../../api-service/api-objects';
import {ResourceFullResponseJson} from "../../../../api-service/api-objects/resource-response-formats/src/resource-full-response-json";

@Component({
    selector: 'awg-bibliography',
    templateUrl: './bibliography.component.html',
    styleUrls: ['./bibliography.component.css']
})
export class BibliographyComponent implements OnInit {

    public bibListResponse: SearchResponseJson = new SearchResponseJson();
    public bibList: SubjectItemJson[];
    public bibItems: ResourceFullResponseJson[];
    private bibIdArray: Array<string> = [];
    private selectedBibItem: SubjectItemJson;
    private isBibListLoaded: boolean = false;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _bibliographyService: BibliographyService
    ) { }

    ngOnInit() {
        this.getBibList();
    }

    /*
     delete(bibItem: BibEntry): void {
        this._bibliographyService
            .delete(bibItem.id)
            .then(() => {
                this.bibList = this.bibList.filter(b => b !== bibItem);
                if (this.selectedBibItem === bibItem) { this.selectedBibItem = null; }
            });
        }
     */

    getBibList(): void {
        this._bibliographyService.getBibliographyList()
            .subscribe((bibListResponse: SearchResponseJson) => {
                    this.bibListResponse = bibListResponse;
                    console.info('BibComp#bibListResponse', this.bibListResponse);
                    this.bibList = this.bibListResponse.subjects.slice(1,10);
                    this.isBibListLoaded = true;
                    this.bibList.forEach(item => {
                        this.bibIdArray.push(item.obj_id);
                    });
                    this.getBibItemsDetails(this.bibIdArray);
                }
            );
    }


    getBibItemsDetails(idArray: Array<string>): void {
        this._bibliographyService.getBibliographyItems(idArray)
            .subscribe((bibItems: ResourceFullResponseJson[]) => {
                console.info('BibComp#bibItem', bibItems);
                this.bibItems = bibItems;
            })
    }

    gotoDetail(id: string): void {
        let link = ['/search', 'bibliography/detail', id];
        this._router.navigate(link);
    }

    onItemSelect(item: SubjectItemJson): void {
        this.selectedBibItem = item;
    }


}
