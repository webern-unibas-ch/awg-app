/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SearchOverviewComponent } from './search-overview.component';

describe('SearchOverviewComponent', () => {
    let component: SearchOverviewComponent;
    let fixture: ComponentFixture<SearchOverviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchOverviewComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
