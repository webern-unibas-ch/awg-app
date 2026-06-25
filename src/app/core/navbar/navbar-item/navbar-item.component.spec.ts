import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

import { NavbarItemComponent } from './navbar-item.component';

describe('NavbarItemComponent', () => {
    let component: NavbarItemComponent;
    let fixture: ComponentFixture<NavbarItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarItemComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarItemComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
