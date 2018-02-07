import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { RouterLinkButton } from './router-link-button.model';

@Component({
    selector: 'awg-router-link-button-group',
    templateUrl: './router-link-button-group.component.html',
    styleUrls: ['./router-link-button-group.component.css']
})
export class RouterLinkButtonGroupComponent implements OnInit {
    @Input() buttonArray: RouterLinkButton;
    @Output() selectButtonRequest: EventEmitter<RouterLinkButton> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onButtonSelect(routerLinkButton: RouterLinkButton): void {
        this.selectButtonRequest.emit(routerLinkButton);
    }

}
