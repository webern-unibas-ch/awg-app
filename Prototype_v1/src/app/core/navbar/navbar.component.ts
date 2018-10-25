import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'awg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    showMobileNav = false;

    constructor() {}

    ngOnInit() {}

    toggleNav(): boolean {
        return (this.showMobileNav = !this.showMobileNav);
    }
}
