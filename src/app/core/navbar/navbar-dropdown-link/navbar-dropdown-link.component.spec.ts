import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { NavbarDropdownLinkComponent } from './navbar-dropdown-link.component';

describe('NavbarDropdownItemComponent', () => {
    let component: NavbarDropdownLinkComponent;
    let fixture: ComponentFixture<NavbarDropdownLinkComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarDropdownLinkComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarDropdownLinkComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
