/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BibliographyComponent } from './bibliography.component';
import { BibliographyListComponent } from '@awg-views/data-view/data-outlets/bibliography/bibliography-list/bibliography-list.component';
import { BibliographySearchComponent } from '@awg-views/data-view/data-outlets/bibliography/bibliography-search/bibliography-search.component';

describe('BibliographyComponent', () => {
    let component: BibliographyComponent;
    let fixture: ComponentFixture<BibliographyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BibliographyComponent, BibliographySearchComponent, BibliographyListComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
