import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';
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
    let expectedFragment: string;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;

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
        expectedSourceListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceListData));
        expectedFragment = 'source_A';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToReportFragmentSpy = spyOn(component, 'navigateToReportFragment').and.callThrough();
        navigateToReportFragmentRequestEmitSpy = spyOn(
            component.navigateToReportFragmentRequest,
            'emit'
        ).and.callThrough();
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
            expectToEqual(component.ref, component);
        });

        describe('VIEW', () => {
            it('... should contain one table with table body (no text sources), but no rows (tr) yet', () => {
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
            expectToEqual(component.sourceListData, expectedSourceListData);
        });

        describe('VIEW', () => {
            it('... should contain one div.card', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
            });

            it('... should contain one div.card-body in div.card', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
            });

            describe('... if text sources are not present', () => {
                it('... should contain one table with table body in div.card-body', () => {
                    getAndExpectDebugElementByCss(compDe, 'div.card-body > table > tbody', 1, 1);
                });

                it('... should contain as many rows (tr) in first table body as sources in sourceListData', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                    getAndExpectDebugElementByCss(tableBodyDes[0], 'tr', expectedSourcesLength, expectedSourcesLength);
                });

                it('... should contain two columns (one th, one td) per table row (tr)', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach(rowDe => {
                        getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                        getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);
                    });
                });

                it('... should contain siglum link in header column (th)', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);

                        const anchorDes = getAndExpectDebugElementByCss(columnDes[0], 'a', 1, 1);
                        const anchorEl = anchorDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(anchorDes[0], 'span', 1, 1);

                        const siglumDes = spanDes[0];
                        const siglumEl = siglumDes.nativeElement;

                        const expectedSiglum = expectedSourceListData.sources[index].siglum;

                        expectToBe(anchorEl.textContent.trim(), expectedSiglum.trim());
                        expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());
                        expect(siglumEl).toHaveClass('awg-source-list-siglum');
                    });
                });

                it('... should display siglum addendum if present in header column (th)', () => {
                    expectedSourceListData.sources[0].siglumAddendum = 'a';
                    expectedSourceListData.sources[1].siglumAddendum = 'b';
                    expectedSourceListData.sources[2].siglumAddendum = 'H';

                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);

                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);

                        const anchorDes = getAndExpectDebugElementByCss(columnDes[0], 'a', 1, 1);
                        const anchorEl = anchorDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(anchorDes[0], 'span', 2, 2);

                        const siglumDes = spanDes[0];
                        const siglumEl = siglumDes.nativeElement;

                        const siglumAddendumDes = spanDes[1];
                        const siglumAddendumEl = siglumAddendumDes.nativeElement;

                        const expectedSiglum = expectedSourceListData.sources[index].siglum;
                        const expectedAddendum = expectedSourceListData.sources[index].siglumAddendum;

                        expectToBe(anchorEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                        expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());
                        expect(siglumEl).toHaveClass('awg-source-list-siglum');

                        expectToBe(siglumAddendumEl.textContent.trim(), expectedAddendum.trim());
                        expect(siglumAddendumEl).toHaveClass('awg-source-list-siglum-addendum');
                    });
                });

                it('... should contain source type and source location in second table column (td)', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const rowDes = getAndExpectDebugElementByCss(
                        compDe,
                        'table > tbody > tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);

                        const spanDes = getAndExpectDebugElementByCss(columnDes[0], 'span', 2, 2);
                        const spanEl0 = spanDes[0].nativeElement;
                        const spanEl1 = spanDes[1].nativeElement;

                        expectToBe(spanEl0.textContent, expectedSourceListData.sources[index].type);
                        expectToBe(spanEl1.textContent, expectedSourceListData.sources[index].location);
                    });
                });
            });

            describe('... if text sources are present', () => {
                beforeEach(() => {
                    expectedSourceListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceListDataWithTexts));
                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);
                });

                it('... should contain two tables with table body in div.card-body', () => {
                    expectedSourceListData = JSON.parse(JSON.stringify(mockEditionData.mockSourceListDataWithTexts));
                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);

                    getAndExpectDebugElementByCss(compDe, 'div.card-body > table > tbody', 2, 2);
                });

                it('... should contain a row (tr) with introductory text as a first child in the second table', () => {
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const firstTrDes = getAndExpectDebugElementByCss(tableBodyDes[1], 'tr:first-child', 1, 1);
                    const firstTrEl = firstTrDes[0].nativeElement;

                    expectToBe(firstTrEl.textContent, 'Zum vertonten Text:');
                });

                it('... should contain as many additional rows (tr) in second table body as text sources in sourceListData', () => {
                    const expectedSourcesLength = expectedSourceListData.textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    getAndExpectDebugElementByCss(tableBodyDes[1], 'tr', expectedSourcesLength, expectedSourcesLength);
                });

                it('... should contain two columns (one th, one td) in each additional row (tr)', () => {
                    const expectedSourcesLength = expectedSourceListData.textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[1],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        if (index === 0) {
                            return;
                        }
                        getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                        getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);
                    });
                });

                it('... should have text siglum id on header column (th)', () => {
                    const expectedSourcesLength = expectedSourceListData.textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[1],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        if (index === 0) {
                            return;
                        }
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);
                        const columnEl = columnDes[0].nativeElement;

                        const expectedId = expectedSourceListData.textSources[index - 1].id;

                        expectToBe(columnEl.id, expectedId);
                    });
                });

                it('... should contain text siglum container span in header column (th)', () => {
                    const expectedSourcesLength = expectedSourceListData.textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[1],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        if (index === 0) {
                            return;
                        }

                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);

                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-text-siglum-container',
                            1,
                            1
                        );
                        const containerEl = containerDes[0].nativeElement;

                        const expectedSiglum =
                            expectedSourceListData.textSources[index - 1].siglum +
                            expectedSourceListData.textSources[index - 1].siglumAddendum;

                        expectToBe(containerEl.textContent.trim(), expectedSiglum.trim());
                    });
                });

                it('... should display text siglum and siglum addendum if present in header column (th)', () => {
                    expectedSourceListData.textSources[0].siglumAddendum = 'a';
                    expectedSourceListData.textSources[1].siglumAddendum = 'H';

                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);

                    const expectedSourcesLength = expectedSourceListData.textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[1],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        if (index === 0) {
                            return;
                        }
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);

                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-text-siglum-container',
                            1,
                            1
                        );
                        const containerEl = containerDes[0].nativeElement;
                        const spanDes = getAndExpectDebugElementByCss(containerDes[0], 'span', 2, 2);

                        const siglumDes = spanDes[0];
                        const siglumEl = siglumDes.nativeElement;

                        const siglumAddendumDes = spanDes[1];
                        const siglumAddendumEl = siglumAddendumDes.nativeElement;

                        const expectedSiglum = expectedSourceListData.textSources[index - 1].siglum;
                        const expectedAddendum = expectedSourceListData.textSources[index - 1].siglumAddendum;

                        expectToBe(containerEl.textContent.trim(), expectedSiglum.trim() + expectedAddendum.trim());

                        expect(siglumEl).toHaveClass('awg-source-list-text-siglum');
                        expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());

                        expect(siglumAddendumEl).toHaveClass('awg-source-list-text-siglum-addendum');
                        expectToBe(siglumAddendumEl.textContent.trim(), expectedAddendum.trim());
                    });
                });

                it('... should contain text source type and text source location in second table column (td)', () => {
                    const expectedSourcesLength = expectedSourceListData.textSources.length + 1;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 2, 2);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[1],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        if (index === 0) {
                            return;
                        }
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'td', 1, 1);

                        const spanDes = getAndExpectDebugElementByCss(columnDes[0], 'span', 2, 2);
                        const spanEl0 = spanDes[0].nativeElement;
                        const spanEl1 = spanDes[1].nativeElement;

                        expectToBe(spanEl0.textContent, expectedSourceListData.textSources[index - 1].type);
                        expectToBe(spanEl1.textContent, expectedSourceListData.textSources[index - 1].location);
                    });
                });
            });
        });

        describe('#navigateToReportFragment()', () => {
            it('... should have a method `navigateToReportFragment`', () => {
                expect(component.navigateToReportFragment).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                // Get anhors in th column
                const anchorDes = getAndExpectDebugElementByCss(compDe, 'table tr > th > a', 3, 3);

                // Everything but first anchor uses modal
                // Click on first anchor
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, expectedFragment);
            }));

            describe('... should not emit anything if', () => {
                it('... id is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... id is empty string', () => {
                    component.navigateToReportFragment('');

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment', () => {
                component.navigateToReportFragment(expectedFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedFragment);

                const otherFragment = 'source_B';
                component.navigateToReportFragment(otherFragment);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, otherFragment);
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
