import { Component, OnInit } from '@angular/core';

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'awg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    isCollapsed = true;
    faEnvelope = faEnvelope;

    constructor() {}

    ngOnInit() {}

    toggleNav(): boolean {
        return (this.isCollapsed = !this.isCollapsed);
    }
}
