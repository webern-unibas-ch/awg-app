import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-structure-view',
    templateUrl: './structure-view.component.html',
    styleUrls: ['./structure-view.component.css']
})
export class StructureViewComponent implements OnInit {

    public structureTitle: string = 'Datenstrukturmodell';
    public structureId: string = 'structure';

    constructor() { }

    ngOnInit() {
    }

}
