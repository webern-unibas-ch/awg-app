import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import Spy = jasmine.Spy;

import { clickAndAwaitChanges } from '@testing/click-helper';
import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { EditionSvgSheet, SourceDescriptionList } from '@awg-views/edition-view/models';

import { SourceDescriptionComponent } from './source-description.component';

describe('SourceDescriptionComponent (DONE)', () => {
    let component: SourceDescriptionComponent;
    let fixture: ComponentFixture<SourceDescriptionComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let expectedSourceDescriptionListData: SourceDescriptionList;
    let expectedSvgSheet: EditionSvgSheet;
    let expectedNextSvgSheet: EditionSvgSheet;
    let expectedModalSnippet: string;

    let openModalSpy: Spy;
    let openModalRequestEmitSpy: Spy;
    let selectSvgSheetSpy: Spy;
    let selectSvgSheetRequestEmitSpy: Spy;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SourceDescriptionComponent, CompileHtmlComponent, RouterLinkStubDirective],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SourceDescriptionComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSvgSheet = {
            id: 'Aa:SkI/2',
            svg: 'assets/img/edition/series1/section5/op12/SkI_2n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_2_small.jpg',
            alt: 'Aa:SkI/2',
        };
        expectedNextSvgSheet = {
            id: 'Aa:SkI/3',
            svg: 'assets/img/edition/series1/section5/op12/SkI_3n_small_cut_opt.svg',
            image: 'assets/img/edition/series1/section5/op12/SkI_3_small.jpg',
            alt: 'Aa:SkI/3',
        };
        expectedModalSnippet = 'OP12_SHEET_COMING_SOON';
        expectedSourceDescriptionListData = {
            sources: [
                {
                    id: 'sourceA',
                    siglum: 'A',
                    location: 'Basel, Paul Sacher Stiftung, Sammlung Anton Webern.',
                    description: [],
                },
                {
                    id: 'sourceAa',
                    siglum: 'Aa',
                    location: '',
                    description: [
                        '<img class="img-thumbnail" [src]="ref.FIRM_SIGNS.OP12.A[0].route" [title]="ref.FIRM_SIGNS.OP12.A[0].full" [alt]="ref.FIRM_SIGNS.OP12.A[0].short" /> <br /> auf Bl. 1<sup>r</sup> unten links (Bl. 1); <br />Notenpapier, 16 Systeme, Format: quer 175 × 270 mm, kein Firmenzeichen (Bl. 2).',
                        '<span class="caps">Inhalt</span>: (<a (click)="ref.openModal(\'OP12_SHEET_COMING_SOON\')"><strong>SkI/1a</strong></a>). (<a (click)="ref.selectSvgSheet(\'Aa:SkI/2\')"><strong>SkI/2</strong></a>).',
                    ],
                },
            ],
        };

        mockDocument = TestBed.inject(DOCUMENT);

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        openModalSpy = spyOn(component, 'openModal').and.callThrough();
        openModalRequestEmitSpy = spyOn(component.openModalRequest, 'emit').and.callThrough();
        selectSvgSheetSpy = spyOn(component, 'selectSvgSheet').and.callThrough();
        selectSvgSheetRequestEmitSpy = spyOn(component.selectSvgSheetRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have sourceDescriptionListData', () => {
            expect(component.sourceDescriptionListData).toBeUndefined('should be undefined');
        });

        it('should have ref', () => {
            expect(component.ref).toBeTruthy();
            // @ts-ignore
            expect(component.ref).toEqual(component, `should equal ${component}`);
        });

        describe('VIEW', () => {
            it('... should contain no div yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.sourceDescriptionListData = expectedSourceDescriptionListData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain one description list div', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-source-description-list', 1, 1);
            });

            it('... should contain two description divs in main div', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    2,
                    2
                );
            });

            it('... should contain two paragraphs in first description div', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    2,
                    2
                );

                const pDes = getAndExpectDebugElementByCss(divDes[0], 'p', 2, 2);

                const pCmp0 = pDes[0].nativeElement;
                const pCmp1 = pDes[1].nativeElement;

                expect(pCmp0.textContent).toBeDefined('should be defined');
                expect(pCmp0.textContent).toBe(
                    expectedSourceDescriptionListData.sources[0].siglum,
                    `should be ${expectedSourceDescriptionListData.sources[0].siglum}`
                );

                expect(pCmp1.textContent).toBeDefined('should be defined');
                expect(pCmp1.textContent).toBe(
                    expectedSourceDescriptionListData.sources[0].location,
                    `should be ${expectedSourceDescriptionListData.sources[0].location}`
                );
            });

            it('... should contain 3 paragraphs in second description div', () => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    2,
                    2
                );

                const pDes = getAndExpectDebugElementByCss(divDes[1], 'p', 3, 3);

                const pCmp0 = pDes[0].nativeElement;
                const pCmp1 = pDes[1].nativeElement;
                const pCmp2 = pDes[2].nativeElement;

                expect(pCmp0.textContent).toBeDefined('should be defined');
                expect(pCmp0.textContent).toBe(
                    expectedSourceDescriptionListData.sources[1].siglum,
                    `should be ${expectedSourceDescriptionListData.sources[1].siglum}`
                );

                // Process HTML expression of description
                const htmlDescription = mockDocument.createElement('p');
                htmlDescription.innerHTML = expectedSourceDescriptionListData.sources[1].description[0];

                expect(pCmp1.textContent).toBeDefined('should be defined');
                expect(pCmp1.textContent.trim()).toBe(
                    htmlDescription.textContent.trim(),
                    `should be ${htmlDescription.textContent.trim()}`
                );

                htmlDescription.innerHTML = expectedSourceDescriptionListData.sources[1].description[1];

                expect(pCmp2.textContent).toBeDefined('should be defined');
                expect(pCmp2.textContent.trim()).toBe(
                    htmlDescription.textContent.trim(),
                    `should be ${htmlDescription.textContent.trim()}`
                );
            });
        });

        describe('#openModal', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    2,
                    2
                );
                const pDes = getAndExpectDebugElementByCss(divDes[1], 'p', 3, 3);

                // Find anchors in third paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[2], 'a', 2, 2);

                // Click on first anchor with modal call
                clickAndAwaitChanges(anchorDes[0], fixture);

                expectSpyCall(openModalSpy, 1, expectedModalSnippet);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.openModal(undefined);

                expectSpyCall(openModalRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of given modal snippet', () => {
                component.openModal(expectedModalSnippet);

                expectSpyCall(openModalRequestEmitSpy, 1, expectedModalSnippet);
            });
        });

        describe('#selectSvgSheet', () => {
            it('... should trigger on click', fakeAsync(() => {
                const divDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-source-description-list > div.awg-source-description',
                    2,
                    2
                );
                const pDes = getAndExpectDebugElementByCss(divDes[1], 'p', 3, 3);

                // Find anchors in third paragraph
                const anchorDes = getAndExpectDebugElementByCss(pDes[2], 'a', 2, 2);

                // CLick on second anchor (with selectSvgSheet call)
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(selectSvgSheetSpy, 1, expectedSvgSheet.id);
            }));

            it('... should not emit anything if no id is provided', () => {
                component.selectSvgSheet(undefined);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 0, undefined);
            });

            it('... should emit id of selected svg sheet', () => {
                component.selectSvgSheet(expectedSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 1, expectedSvgSheet.id);

                component.selectSvgSheet(expectedNextSvgSheet.id);

                expectSpyCall(selectSvgSheetRequestEmitSpy, 2, expectedNextSvgSheet.id);
            });
        });
    });
});
