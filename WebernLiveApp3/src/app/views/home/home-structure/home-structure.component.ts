import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-home-structure',
    templateUrl: './home-structure.component.html',
    styleUrls: ['./home-structure.component.css']
})
export class HomeStructureComponent implements OnInit {
    public structureTitle: string = 'Datenstrukturmodell';
    public structureId: string = 'structure';

    constructor() { }

    ngOnInit() {
    }

}
