import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';

import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { TableComponent } from './table.component';

@Component({ selector: 'awg-twelve-tone-spinner', template: '' })
class TwelveToneSpinnerStubComponent {}

describe('TableComponent', () => {
    let component: TableComponent;
    let fixture: ComponentFixture<TableComponent>;
    let compDe: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbPaginationModule],
            declarations: [TableComponent, TwelveToneSpinnerStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TableComponent);

        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
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
