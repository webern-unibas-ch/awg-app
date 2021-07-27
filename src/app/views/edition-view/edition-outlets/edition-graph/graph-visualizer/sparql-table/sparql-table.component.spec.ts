import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { SparqlTableComponent } from './sparql-table.component';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

describe('SparqlTableComponent', () => {
    let component: SparqlTableComponent;
    let fixture: ComponentFixture<SparqlTableComponent>;
    let compDe: DebugElement;
    let compEl: any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbPaginationModule],
            declarations: [SparqlTableComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have queryResult', () => {
            expect(component.queryResult).toBeUndefined('should be undefined');
        });

        it('... should not have queryTime', () => {
            expect(component.queryTime).toBeUndefined('should be undefined');
        });

        it('... should not have paginatorOptions', () => {
            expect(component.paginatorOptions).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one ngb-accordion without panel (div.card) yet', () => {
                // Ngb-accordion debug element
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'ngb-accordion', 1, 1);

                // Panel
                getAndExpectDebugElementByCss(accordionDes[0], 'div.card', 0, 0, 'yet');
            });
        });
    });
});
