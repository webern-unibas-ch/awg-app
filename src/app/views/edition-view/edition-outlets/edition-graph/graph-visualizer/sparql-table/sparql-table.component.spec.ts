import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { SparqlTableComponent } from './sparql-table.component';

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('SparqlTableComponent', () => {
    let component: SparqlTableComponent;
    let fixture: ComponentFixture<SparqlTableComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbPaginationModule],
            declarations: [SparqlTableComponent, TwelveToneSpinnerStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SparqlTableComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have queryResult', () => {
            expect(component.queryResult).toBeUndefined('should be undefined');
        });

        it('should not have queryTime', () => {
            expect(component.queryTime).toBeUndefined('should be undefined');
        });

        it('should not have paginatorOptions', () => {
            expect(component.paginatorOptions).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain no form yet', () => {
                getAndExpectDebugElementByCss(compDe, 'form', 0, 0);
            });

            it('... should contain no pagination divs yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-pagination', 0, 0);
            });

            it('... should contain no table yet', () => {
                getAndExpectDebugElementByCss(compDe, 'table.table', 0, 0);
            });

            it('... should not display TwelveToneSpinnerComponent (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, TwelveToneSpinnerStubComponent, 0, 0);
            });
        });
    });
});
