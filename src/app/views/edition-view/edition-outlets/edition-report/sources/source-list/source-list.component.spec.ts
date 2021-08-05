import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { SourceList } from '@awg-views/edition-view/models';

import { SourceListComponent } from './source-list.component';

describe('SourceListComponent (DONE)', () => {
    let component: SourceListComponent;
    let fixture: ComponentFixture<SourceListComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedSourceListData: SourceList;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [RouterTestingModule],
                declarations: [SourceListComponent, CompileHtmlComponent, RouterLinkStubDirective],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // Test data
        expectedSourceListData = {
            sources: [
                {
                    siglum: 'A',
                    type: 'Skizzen',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    linkTo: 'sourceA',
                },
                {
                    siglum: 'B',
                    type: 'Autograph von Nr. I.',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    linkTo: 'OP12_SOURCE_NOT_A',
                },
                {
                    siglum: 'C',
                    type: 'Autograph von Nr. I–IV.',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    linkTo: 'OP12_SOURCE_NOT_A',
                },
            ],
        };

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have sourceListData', () => {
            expect(component.sourceListData).toBeUndefined('should be undefined');
        });

        it('should have ref', () => {
            expect(component.ref).toBeTruthy();
            // @ts-ignore
            expect(component.ref).toEqual(component, `should equal ${component}`);
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

        it('should have sourceListData', () => {
            expect(component.sourceListData).toBe(expectedSourceListData);
        });

        describe('VIEW', () => {
            it('... should contain three rows (tr) in table body', () => {
                const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                getAndExpectDebugElementByCss(tableBodyDes[0], 'tr', 3, 3);
            });

            it('... should contain two columns (td) per table row (tr)', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                getAndExpectDebugElementByCss(rowDes[0], 'td', 2, 2);
                getAndExpectDebugElementByCss(rowDes[1], 'td', 2, 2);
                getAndExpectDebugElementByCss(rowDes[2], 'td', 2, 2);
            });

            it('... should contain siglum link in first table column', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                // Get columns
                const columnDes0 = getAndExpectDebugElementByCss(rowDes[0], 'td', 2, 2);
                const columnDes1 = getAndExpectDebugElementByCss(rowDes[1], 'td', 2, 2);
                const columnDes2 = getAndExpectDebugElementByCss(rowDes[2], 'td', 2, 2);

                // Get anchors in first column
                const anchorDes0 = getAndExpectDebugElementByCss(columnDes0[0], 'a', 1, 1);
                const anchorDes1 = getAndExpectDebugElementByCss(columnDes1[0], 'a', 1, 1);
                const anchorDes2 = getAndExpectDebugElementByCss(columnDes2[0], 'a', 1, 1);

                const anchorCmp0 = anchorDes0[0].nativeElement;
                const anchorCmp1 = anchorDes1[0].nativeElement;
                const anchorCmp2 = anchorDes2[0].nativeElement;

                expect(anchorCmp0.textContent).toBeDefined('should be defined');
                expect(anchorCmp0.textContent).toBe(
                    expectedSourceListData.sources[0].siglum,
                    `should be ${expectedSourceListData.sources[0].siglum}`
                );

                expect(anchorCmp1.textContent).toBeDefined('should be defined');
                expect(anchorCmp1.textContent).toBe(
                    expectedSourceListData.sources[1].siglum,
                    `should be ${expectedSourceListData.sources[1].siglum}`
                );

                expect(anchorCmp2.textContent).toBeDefined('should be defined');
                expect(anchorCmp2.textContent).toBe(
                    expectedSourceListData.sources[2].siglum,
                    `should be ${expectedSourceListData.sources[2].siglum}`
                );
            });

            it('... should contain source type and source location in second table column', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'table > tbody > tr', 3, 3);

                // Get columns
                const columnDes0 = getAndExpectDebugElementByCss(rowDes[0], 'td', 2, 2);
                const columnDes1 = getAndExpectDebugElementByCss(rowDes[1], 'td', 2, 2);
                const columnDes2 = getAndExpectDebugElementByCss(rowDes[2], 'td', 2, 2);

                // Get spans in second column
                const spanDes0 = getAndExpectDebugElementByCss(columnDes0[1], 'span', 2, 2);
                const spanDes1 = getAndExpectDebugElementByCss(columnDes1[1], 'span', 2, 2);
                const spanDes2 = getAndExpectDebugElementByCss(columnDes2[1], 'span', 2, 2);

                const spanCmp00 = spanDes0[0].nativeElement;
                const spanCmp01 = spanDes0[1].nativeElement;
                const spanCmp10 = spanDes1[0].nativeElement;
                const spanCmp11 = spanDes1[1].nativeElement;
                const spanCmp20 = spanDes2[0].nativeElement;
                const spanCmp21 = spanDes2[1].nativeElement;

                expect(spanCmp00.textContent).toBeDefined('should be defined');
                expect(spanCmp00.textContent).toBe(
                    expectedSourceListData.sources[0].type,
                    `should be ${expectedSourceListData.sources[0].type}`
                );
                expect(spanCmp01.textContent).toBeDefined('should be defined');
                expect(spanCmp01.textContent).toBe(
                    expectedSourceListData.sources[0].location,
                    `should be ${expectedSourceListData.sources[0].location}`
                );

                expect(spanCmp10.textContent).toBeDefined('should be defined');
                expect(spanCmp10.textContent).toBe(
                    expectedSourceListData.sources[1].type,
                    `should be ${expectedSourceListData.sources[1].type}`
                );
                expect(spanCmp11.textContent).toBeDefined('should be defined');
                expect(spanCmp11.textContent).toBe(
                    expectedSourceListData.sources[1].location,
                    `should be ${expectedSourceListData.sources[1].location}`
                );

                expect(spanCmp20.textContent).toBeDefined('should be defined');
                expect(spanCmp20.textContent).toBe(
                    expectedSourceListData.sources[2].type,
                    `should be ${expectedSourceListData.sources[2].type}`
                );
                expect(spanCmp21.textContent).toBeDefined('should be defined');
                expect(spanCmp21.textContent).toBe(
                    expectedSourceListData.sources[2].location,
                    `should be ${expectedSourceListData.sources[2].location}`
                );
            });
        });

        describe('#openModal', () => {
            it('... should trigger on click', fakeAsync(() => {
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'table tr > td > a', 3, 3);

                // Everything but first anchor uses modal
                // Click on second anchor
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(openModalSpy, 1, expectedSourceListData.sources[1].linkTo);

                // Click on third anchor
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(openModalSpy, 2, expectedSourceListData.sources[2].linkTo);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.openModal(undefined);

                expectSpyCall(openModalRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedSourceListData.sources[2].linkTo);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedSourceListData.sources[2].linkTo);
            });
        });
    });
});
