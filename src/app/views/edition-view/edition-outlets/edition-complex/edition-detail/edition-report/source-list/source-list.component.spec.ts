import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

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

    let navigateToReportFragmentSpy: Spy;
    let navigateToReportFragmentRequestEmitSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let openModalSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule],
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
            it('... should contain one div.card with with div.card-body, but no tables yet', () => {
                const divCardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                getAndExpectDebugElementByCss(divCardBodyDes[0], 'table', 0, 0);
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
            describe('... without any sources', () => {
                beforeEach(() => {
                    expectedSourceListData = {
                        sources: [],
                        textSources: [],
                    };
                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);
                });

                it('... should contain no tables with in div.card-body', () => {
                    const divCardBodyDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                    getAndExpectDebugElementByCss(divCardBodyDes[0], 'table', 0, 0);
                });
            });

            describe('... with only musical sources', () => {
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

                it('... should contain siglum container span in header column (th)', () => {
                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                    const rowDes = getAndExpectDebugElementByCss(
                        tableBodyDes[0],
                        'tr',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    rowDes.forEach((rowDe, index) => {
                        const columnDes = getAndExpectDebugElementByCss(rowDe, 'th', 1, 1);

                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-siglum-container',
                            1,
                            1
                        );
                        const containerEl = containerDes[0].nativeElement;

                        const expectedSiglum =
                            expectedSourceListData.sources[index].siglum +
                            expectedSourceListData.sources[index].siglumAddendum;

                        if (expectedSourceListData.sources[index].missing) {
                            expectToBe(containerEl.textContent.trim(), `[${expectedSiglum}]`);
                        } else {
                            expectToBe(containerEl.textContent.trim(), expectedSiglum.trim());
                        }
                    });
                });

                it('... should contain siglum link as link text in header column (th)', () => {
                    expectedSourceListData.sources[2].missing = false;

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
                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-siglum-container',
                            1,
                            1
                        );

                        const anchorDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
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

                it('... should display siglum addendum as link text if present in header column (th)', () => {
                    expectedSourceListData.sources[0].siglumAddendum = 'a';
                    expectedSourceListData.sources[1].siglumAddendum = 'b';
                    expectedSourceListData.sources[2].siglumAddendum = 'H';
                    expectedSourceListData.sources[2].missing = false;

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
                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-siglum-container',
                            1,
                            1
                        );

                        const anchorDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
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

                it('... should display missing sources in brackets as link text in header column (th)', () => {
                    expectedSourceListData.sources[0].missing = true;
                    expectedSourceListData.sources[1].missing = true;
                    expectedSourceListData.sources[2].missing = true;

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
                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-siglum-container',
                            1,
                            1
                        );

                        const anchorDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
                        const anchorEl = anchorDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(anchorDes[0], 'span', 3, 3);

                        const openingBracketDes = spanDes[0];
                        const siglumDes = spanDes[1];
                        const closingBracketDes = spanDes[2];

                        const openingBracketEl = openingBracketDes.nativeElement;
                        const siglumEl = siglumDes.nativeElement;
                        const closingBracketEl = closingBracketDes.nativeElement;

                        const expectedSiglum = expectedSourceListData.sources[index].siglum;

                        expectToBe(anchorEl.textContent.trim(), `[${expectedSiglum}]`);

                        expectToBe(openingBracketEl.textContent.trim(), '[');
                        expectToBe(closingBracketEl.textContent.trim(), ']');

                        expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());
                        expect(siglumEl).toHaveClass('awg-source-list-siglum');
                    });
                });

                it('... should display missing sources with addendum in brackets as link text in header column (th)', () => {
                    expectedSourceListData.sources[0].siglumAddendum = 'a';
                    expectedSourceListData.sources[1].siglumAddendum = 'H';
                    expectedSourceListData.sources[2].siglumAddendum = 'F1-F2';

                    expectedSourceListData.sources[0].missing = true;
                    expectedSourceListData.sources[1].missing = true;
                    expectedSourceListData.sources[2].missing = true;

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
                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-siglum-container',
                            1,
                            1
                        );

                        const anchorDes = getAndExpectDebugElementByCss(containerDes[0], 'a', 1, 1);
                        const anchorEl = anchorDes[0].nativeElement;

                        const spanDes = getAndExpectDebugElementByCss(anchorDes[0], 'span', 4, 4);

                        const openingBracketDes = spanDes[0];
                        const siglumDes = spanDes[1];
                        const siglumAddendumDes = spanDes[2];
                        const closingBracketDes = spanDes[3];

                        const openingBracketEl = openingBracketDes.nativeElement;
                        const siglumEl = siglumDes.nativeElement;
                        const siglumAddendumEl = siglumAddendumDes.nativeElement;
                        const closingBracketEl = closingBracketDes.nativeElement;

                        const expectedSiglum = expectedSourceListData.sources[index].siglum;
                        const expectedAddendum = expectedSourceListData.sources[index].siglumAddendum;

                        expectToBe(anchorEl.textContent.trim(), `[${expectedSiglum}${expectedAddendum}]`);

                        expectToBe(openingBracketEl.textContent.trim(), '[');
                        expectToBe(closingBracketEl.textContent.trim(), ']');

                        expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());
                        expect(siglumEl).toHaveClass('awg-source-list-siglum');

                        expectToBe(siglumAddendumEl.textContent.trim(), expectedAddendum.trim());
                        expect(siglumAddendumEl).toHaveClass('awg-source-list-siglum-addendum');
                    });
                });

                it('... should contain link to report fragment for sources with description and linkTo value', fakeAsync(() => {
                    expectedSourceListData = {
                        sources: [
                            {
                                siglum: 'A',
                                siglumAddendum: '',
                                type: 'Test type 3',
                                location: 'Test location 3.',
                                hasDescription: true,
                                linkTo: 'source_A',
                            },
                        ],
                    };
                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);

                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                    const anchorDes = getAndExpectDebugElementByCss(
                        tableBodyDes[0],
                        'tr > th > span.awg-source-list-siglum-container > a',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: 'source_A' });
                }));

                it('... should contain link to openModal for sources without description but linkTo value', fakeAsync(() => {
                    expectedSourceListData = {
                        sources: [
                            {
                                siglum: 'B',
                                siglumAddendum: '',
                                type: 'Test type 3',
                                location: 'Test location 3.',
                                hasDescription: false,
                                linkTo: 'MODAL_TEXT',
                            },
                        ],
                    };
                    component.sourceListData = expectedSourceListData;
                    detectChangesOnPush(fixture);

                    const expectedSourcesLength = expectedSourceListData.sources.length;
                    const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                    const anchorDes = getAndExpectDebugElementByCss(
                        tableBodyDes[0],
                        'tr > th > span.awg-source-list-siglum-container > a',
                        expectedSourcesLength,
                        expectedSourcesLength
                    );

                    clickAndAwaitChanges(anchorDes[0], fixture);

                    expectSpyCall(openModalSpy, 1, 'MODAL_TEXT');
                }));

                it('... should contain no link for missing sources without description and linkTo value', () => {
                    expectedSourceListData = {
                        sources: [
                            {
                                siglum: 'C',
                                siglumAddendum: '',
                                missing: true,
                                type: 'Test type 3',
                                location: 'Test location 3.',
                                hasDescription: false,
                                linkTo: '',
                            },
                        ],
                    };
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
                        const containerDes = getAndExpectDebugElementByCss(
                            columnDes[0],
                            'span.awg-source-list-siglum-container',
                            1,
                            1
                        );

                        getAndExpectDebugElementByCss(containerDes[0], 'a', 0, 0);

                        const spanDes = getAndExpectDebugElementByCss(containerDes[0], 'span', 3, 3);

                        const openingBracketDes = spanDes[0];
                        const siglumDes = spanDes[1];
                        const closingBracketDes = spanDes[2];

                        const openingBracketEl = openingBracketDes.nativeElement;
                        const siglumEl = siglumDes.nativeElement;
                        const closingBracketEl = closingBracketDes.nativeElement;

                        const expectedSiglum = expectedSourceListData.sources[index].siglum;

                        expectToBe(openingBracketEl.textContent.trim(), '[');
                        expectToBe(closingBracketEl.textContent.trim(), ']');

                        expectToBe(siglumEl.textContent.trim(), expectedSiglum.trim());
                        expect(siglumEl).toHaveClass('awg-source-list-siglum');
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

            describe('... with musical and text sources', () => {
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
                const expectedSourcesLength = expectedSourceListData.sources.length;
                const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                const anchorDes = getAndExpectDebugElementByCss(
                    tableBodyDes[0],
                    'tr > th > span.awg-source-list-siglum-container > a',
                    expectedSourcesLength,
                    expectedSourcesLength
                );

                // Everything but first anchor uses modal
                // Click on first anchor
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(navigateToReportFragmentSpy, 1, { complexId: '', fragmentId: expectedFragment });
            }));

            describe('... should not emit anything if', () => {
                it('... paraemeter is undefined', () => {
                    component.navigateToReportFragment(undefined);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... parameter is null', () => {
                    component.navigateToReportFragment(null);

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is undefined', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: undefined });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is null', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: null });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
                it('... fragment id is empty string', () => {
                    component.navigateToReportFragment({ complexId: 'testComplex', fragmentId: '' });

                    expectSpyCall(navigateToReportFragmentRequestEmitSpy, 0);
                });
            });

            it('... should emit id of selected report fragment within same complex', () => {
                const expectedReportIds = { complexId: 'testComplex', fragmentId: expectedFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: 'testComplex', fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });

            it('... should emit id of selected report fragment for another complex', () => {
                const expectedReportIds = { complexId: 'testComplex', fragmentId: expectedFragment };
                component.navigateToReportFragment(expectedReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 1, expectedReportIds);

                const otherFragment = 'source_B';
                const expectedNextReportIds = { complexId: 'anotherTestComplex', fragmentId: otherFragment };
                component.navigateToReportFragment(expectedNextReportIds);

                expectSpyCall(navigateToReportFragmentRequestEmitSpy, 2, expectedNextReportIds);
            });
        });

        describe('#openModal()', () => {
            it('... should have a method `openModal`', () => {
                expect(component.openModal).toBeDefined();
            });

            it('... should trigger on click', fakeAsync(() => {
                const expectedSourcesLength = expectedSourceListData.sources.length;
                const tableBodyDes = getAndExpectDebugElementByCss(compDe, 'table > tbody', 1, 1);

                const anchorDes = getAndExpectDebugElementByCss(
                    tableBodyDes[0],
                    'tr > th > span.awg-source-list-siglum-container > a',
                    expectedSourcesLength,
                    expectedSourcesLength
                );

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
