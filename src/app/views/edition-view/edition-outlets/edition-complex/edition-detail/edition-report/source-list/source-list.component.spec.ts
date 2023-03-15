import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { SourceList } from '@awg-views/edition-view/models';

import { SourceListComponent } from './source-list.component';

describe('SourceListComponent (DONE)', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let compDe: DebugElement;

    let expectedSourceListData: SourceList;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [SourceListComponent, CompileHtmlComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSourceListData = mockEditionData.mockSourceListData;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have sourceListData', () => {
            expect(component.sourceListData).toBeUndefined();
        });

        it('... should have `ref`', () => {
            expect(component.ref).toBeTruthy();
            expect(component.ref).withContext(`should equal ${component}`).toEqual(component);
        });

        describe('VIEW', () => {
            it('... should contain one table with table body, but no rows (tr) yet', () => {
                const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                getAndExpectDebugElementByCss(tableBodyDes[0], 'tr', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.sourceListData = expectedSourceListData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have sourceListData', () => {
            expect(component.sourceListData).toBeTruthy();
            expect(component.sourceListData)
                .withContext(`should equal ${expectedSourceListData}`)
                .toEqual(expectedSourceListData);
        });

        describe('VIEW', () => {
            it('... should contain three rows (tr) in table body', () => {
                const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                getAndExpectDebugElementByCss(tableBodyDes[0], 'tr', 3, 3);
            });

            it('... should contain two columns (one th, one td) per table row (tr)', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                getAndExpectDebugElementByCss(rowDes[0], 'th', 1, 1);
                getAndExpectDebugElementByCss(rowDes[0], 'td', 1, 1);
                getAndExpectDebugElementByCss(rowDes[1], 'th', 1, 1);
                getAndExpectDebugElementByCss(rowDes[1], 'td', 1, 1);
                getAndExpectDebugElementByCss(rowDes[2], 'th', 1, 1);
                getAndExpectDebugElementByCss(rowDes[2], 'td', 1, 1);
            });

            it('... should contain siglum link in header column (th)', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                // Get th columns
                const columnDes0 = getAndExpectDebugElementByCss(rowDes[0], 'th', 1, 1);
                const columnDes1 = getAndExpectDebugElementByCss(rowDes[1], 'th', 1, 1);
                const columnDes2 = getAndExpectDebugElementByCss(rowDes[2], 'th', 1, 1);

                // Get anchors in th column
                const anchorDes0 = getAndExpectDebugElementByCss(columnDes0[0], 'a', 1, 1);
                const anchorDes1 = getAndExpectDebugElementByCss(columnDes1[0], 'a', 1, 1);
                const anchorDes2 = getAndExpectDebugElementByCss(columnDes2[0], 'a', 1, 1);

                const anchorEl0 = anchorDes0[0].nativeElement;
                const anchorEl1 = anchorDes1[0].nativeElement;
                const anchorEl2 = anchorDes2[0].nativeElement;

                expect(anchorEl0.textContent).withContext('should be defined').toBeDefined();
                expect(anchorEl0.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[0].siglum}`)
                    .toBe(expectedSourceListData.sources[0].siglum);

                expect(anchorEl1.textContent).withContext('should be defined').toBeDefined();
                expect(anchorEl1.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[1].siglum}`)
                    .toBe(expectedSourceListData.sources[1].siglum);

                expect(anchorEl2.textContent).withContext('should be defined').toBeDefined();
                expect(anchorEl2.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[2].siglum}`)
                    .toBe(expectedSourceListData.sources[2].siglum);
            });

            it('... should contain source type and source location in second table column (td)', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                // Get td columns
                const columnDes0 = getAndExpectDebugElementByCss(rowDes[0], 'td', 1, 1);
                const columnDes1 = getAndExpectDebugElementByCss(rowDes[1], 'td', 1, 1);
                const columnDes2 = getAndExpectDebugElementByCss(rowDes[2], 'td', 1, 1);

                // Get spans in td column
                const spanDes0 = getAndExpectDebugElementByCss(columnDes0[0], 'span', 2, 2);
                const spanDes1 = getAndExpectDebugElementByCss(columnDes1[0], 'span', 2, 2);
                const spanDes2 = getAndExpectDebugElementByCss(columnDes2[0], 'span', 2, 2);

                const spanEl00 = spanDes0[0].nativeElement;
                const spanEl01 = spanDes0[1].nativeElement;
                const spanEl10 = spanDes1[0].nativeElement;
                const spanEl11 = spanDes1[1].nativeElement;
                const spanEl20 = spanDes2[0].nativeElement;
                const spanEl21 = spanDes2[1].nativeElement;

                expect(spanEl00.textContent).withContext('should be defined').toBeDefined();
                expect(spanEl00.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[0].type}`)
                    .toBe(expectedSourceListData.sources[0].type);

                expect(spanEl01.textContent).withContext('should be defined').toBeDefined();
                expect(spanEl01.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[0].location}`)
                    .toBe(expectedSourceListData.sources[0].location);

                expect(spanEl10.textContent).withContext('should be defined').toBeDefined();
                expect(spanEl10.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[1].type}`)
                    .toBe(expectedSourceListData.sources[1].type);

                expect(spanEl11.textContent).withContext('should be defined').toBeDefined();
                expect(spanEl11.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[1].location}`)
                    .toBe(expectedSourceListData.sources[1].location);

                expect(spanEl20.textContent).withContext('should be defined').toBeDefined();
                expect(spanEl20.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[2].type}`)
                    .toBe(expectedSourceListData.sources[2].type);

                expect(spanEl21.textContent).withContext('should be defined').toBeDefined();
                expect(spanEl21.textContent)
                    .withContext(`should be ${expectedSourceListData.sources[2].location}`)
                    .toBe(expectedSourceListData.sources[2].location);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                // Get anhors in th column
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'table tr > th > a', 3, 3);

                // Everything but first anchor uses modal
                // Click on second anchor
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedSourceListData.sources[1].linkTo);

                // Click on third anchor
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(openModalSpy, 2, expectedSourceListData.sources[2].linkTo);
            }));

            describe('... should not emit anything if ', () => {
                it('... id is undefined', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });

                it('... id is null', () => {
                    component.openModal(undefined);

                    expectSpyCall(openModalRequestEmitSpy, 0, null);
                });
                it('... id is empty string', () => {
                    component.openModal('');

                    expectSpyCall(openModalRequestEmitSpy, 0);
                });
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedSourceListData.sources[2].linkTo);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedSourceListData.sources[2].linkTo);
            });
        });
    });
});
