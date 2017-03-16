import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material'

@Component({
  selector: 'awg-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

    public title: string;
    public content: string;

    constructor(
        public dialogRef: MdDialogRef<DialogComponent>
    ) { }

}
