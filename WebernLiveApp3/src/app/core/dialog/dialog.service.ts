import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

import { DialogComponent } from './dialog.component';

@Injectable()
export class DialogService {

    constructor(
        private dialog: MatDialog
    ) { }

    public openEditionDialog(identifier: string): Observable<boolean> {
        const title: string = 'Hinweis';
        let content: string = editionDialogContent[identifier];
        let dialogRef: MatDialogRef<DialogComponent>;

        dialogRef = this.dialog.open(DialogComponent);
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.content = content;

        return dialogRef.afterClosed();
    }
}

//TODO: move to seperate class?
const editionDialogContent: Object = {
    'sourceNotA': '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>B</strong> bis <strong>G1</strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
    'sheetComingSoon': 'Die edierten Notentexte von <strong>Aa:SkI/1</strong>, <strong>Ab:SkII/1</strong>, <strong>Ac:SkIII/1</strong> und <strong>Ac:SkIII/7</strong> sowie <strong>Ae:SkIV/1</strong> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.',
    'editionComingSoon': '<p>Die Einleitungen, edierten Notentexte und Kritischen Berichte zu</p><ul class="none"><li>Werkedition der Druckfassung der <i>Vier Lieder</i> op. 12 <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 1) <br/> Textedition von Nr. I „<i>Der Tag ist vergangen</i>“ (Fassung 2) <br/> Textedition von Nr. IV <i>Gleich und Gleich</i> (Fassung 1) </li></ul><p> erscheinen im Zusammenhang der vollständigen Edition der <i>Vier Lieder</i> op. 12 in AWG I/5.</p>',
    'M198': '<p>Das Fragment „<em>Schien mir’s als ich sah die Sonne</em>“ (M 198) für Chor und Orchester wird in AWG II/3 ediert.</p>'
};
