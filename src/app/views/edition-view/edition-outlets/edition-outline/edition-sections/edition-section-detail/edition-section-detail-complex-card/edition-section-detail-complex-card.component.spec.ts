import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { DebugElement, isSignal, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { EditionStateHelper } from '@testing/edition-state-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { ButtonMoreComponent } from '@awg-shared/button-more/button-more.component';
import { EditionOutlineComplexItem } from '@awg-views/edition-view/models';

import { EditionSectionDetailComplexCardComponent } from './edition-section-detail-complex-card.component';

describe('EditionSectionDetailComplexCardComponent (DONE)', () => {
    let component: EditionSectionDetailComplexCardComponent;
    let fixture: ComponentFixture<EditionSectionDetailComplexCardComponent>;
    let compDe: DebugElement;

    let expectedComplexes: EditionOutlineComplexItem[];
    let expectedLength: number;

    beforeAll(() => {
        registerLocaleData(localeDeDE);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditionSectionDetailComplexCardComponent, ButtonMoreComponent, DatePipe, RouterLink],
            providers: [provideRouter([]), { provide: LOCALE_ID, useValue: 'de-DE' }],
        }).compileComponents();
    });

    beforeEach(() => {
        // Test data
        const section = EditionStateHelper.getSection('1', '5');
        expectedComplexes = section?.content.sectionComplexes ?? [];
        expectedLength = expectedComplexes.length;

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionDetailComplexCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `displayedComplexes`', () => {
            expectToBe(isSignal(component.displayedComplexes), true);
            expect(() => component.displayedComplexes()).toThrow();
        });

        describe('VIEW', () => {
            it('... should have no outer div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('displayedComplexes', expectedComplexes);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `displayedComplexes` to hold the expected complexes', () => {
            expectToEqual(component.displayedComplexes(), expectedComplexes);
        });

        describe('VIEW', () => {
            const getRowDes = () => getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            const getColDes = () =>
                getAndExpectDebugElementByCss(getRowDes()[0], 'div.col', expectedLength, expectedLength);
            const getCardDes = () =>
                getAndExpectDebugElementByCss(compDe, 'div.card.awg-edition-card', expectedLength, expectedLength);
            const getCardBodyDes = () =>
                getAndExpectDebugElementByCss(compDe, 'div.card-body', expectedLength, expectedLength);
            const getCardTitleDes = () =>
                getAndExpectDebugElementByCss(compDe, 'h5.card-title', expectedLength, expectedLength);
            const getCardFooterDes = () =>
                getAndExpectDebugElementByCss(compDe, 'div.card-footer', expectedLength, expectedLength);
            const getCardFooterParagraphDes = () =>
                getAndExpectDebugElementByCss(compDe, 'p.text-end', expectedLength, expectedLength);

            it('... should render no content if displayed complexes are not available', () => {
                fixture.componentRef.setInput('displayedComplexes', null);

                fixture.detectChanges();

                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });

            it('... should have one outer div.row', () => {
                getRowDes();
            });

            it('... should have as many inner div.col as editionComplexes in outer div.row', () => {
                getColDes();
            });

            it('... should have as many inner div.card.awg-edition-card as editionComplexes', () => {
                getCardDes();
            });

            it('... should have as many inner div.card-body as editionComplexes', () => {
                getCardBodyDes();
            });

            it('... should have as many inner h5.card-title as editionComplexes', () => {
                getCardTitleDes();
            });

            it('... should text-mute card titles of disabled editionComplexes', () => {
                const cardTitleDes = getCardTitleDes();
                cardTitleDes.forEach((cardTitleDe, index) => {
                    const cardTitleEl: HTMLHeadingElement = cardTitleDe.nativeElement;

                    if (expectedComplexes[index].disabled) {
                        expectToContain(cardTitleEl.classList, 'text-muted');
                    } else {
                        expectToNotContain(cardTitleEl.classList, 'text-muted');
                    }
                });
            });

            it('... should display complex as card title in span.awg-edition-info-header-title', () => {
                const cardTitleDes = getCardTitleDes();
                cardTitleDes.forEach((cardTitleDe, index) => {
                    const titleSpanDes = getAndExpectDebugElementByCss(
                        cardTitleDe,
                        'span.awg-edition-info-header-title',
                        1,
                        1
                    );
                    const titleSpanEl: HTMLSpanElement = titleSpanDes[0].nativeElement;

                    expectToBe(titleSpanEl.innerHTML, expectedComplexes[index].complex.complexId.full);
                });
            });

            it('... should have as many inner div.card-footer as editionComplexes', () => {
                getCardFooterDes();
            });

            it('... should have edition responsibility statement in div.card-footer if complex is not disabled', () => {
                const cardFooterDes = getCardFooterDes();
                cardFooterDes.forEach((cardFooterDe, index) => {
                    if (!expectedComplexes[index].disabled) {
                        getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 1, 1);
                    } else {
                        getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 0, 0);
                    }
                });
            });

            it('... should display as many editors in span.editor as there are editors', () => {
                const cardFooterDes = getCardFooterDes();
                cardFooterDes.forEach((cardFooterDe, index) => {
                    if (!expectedComplexes[index].disabled) {
                        const pDes = getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 1, 1);
                        const editors = expectedComplexes[index].complex.respStatement.editors;
                        const editorSpanDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.editor',
                            editors.length,
                            editors.length
                        );

                        editorSpanDes.forEach((editorSpanDe, editorIndex) => {
                            const editorSpanEl: HTMLSpanElement = editorSpanDe.nativeElement;

                            expectToBe(editorSpanEl.textContent.trim(), editors[editorIndex].name);
                        });
                    }
                });
            });

            it('... should link to homepage of editors in span.editor', () => {
                const cardFooterDes = getCardFooterDes();
                cardFooterDes.forEach((cardFooterDe, index) => {
                    if (!expectedComplexes[index].disabled) {
                        const pDes = getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 1, 1);
                        const editors = expectedComplexes[index].complex.respStatement.editors;
                        const editorSpanDes = getAndExpectDebugElementByCss(
                            pDes[0],
                            'span.editor',
                            editors.length,
                            editors.length
                        );

                        editorSpanDes.forEach((editorSpanDe, editorIndex) => {
                            const aDes = getAndExpectDebugElementByCss(editorSpanDe, 'a', 1, 1);
                            const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                            expectToBe(aEl.href, editors[editorIndex].homepage);
                        });
                    }
                });
            });

            it('... should render a separator between editors, but omit it after the last editor', () => {
                const enabledComplex = expectedComplexes.find(
                    complexItem => !complexItem.disabled
                ) as EditionOutlineComplexItem;

                const expectedComplexWithMultipleEditors = {
                    ...structuredClone(enabledComplex),
                    complex: {
                        ...structuredClone(enabledComplex.complex),
                        respStatement: {
                            ...structuredClone(enabledComplex.complex.respStatement),
                            editors: [
                                { name: 'Editor One', homepage: 'https://example.com/editor-one' },
                                { name: 'Editor Two', homepage: 'https://example.com/editor-two' },
                            ],
                        },
                    },
                } as unknown as EditionOutlineComplexItem;

                fixture.componentRef.setInput('displayedComplexes', [expectedComplexWithMultipleEditors]);
                fixture.detectChanges();

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-edition-responsibility', 1, 1);
                const editorSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.editor', 2, 2);

                const separatorDes = getAndExpectDebugElementByCss(editorSpanDes[0], 'span', 1, 1);
                const separatorEl: HTMLSpanElement = separatorDes[0].nativeElement;
                getAndExpectDebugElementByCss(editorSpanDes[1], 'span', 0, 0);

                expectToBe(separatorEl.textContent.trim(), '&');
            });

            it('... should display formatted date in span.version if complex is not disabled and lastModified is an ISO date', () => {
                const cardFooterDes = getCardFooterDes();
                const datePipe = new DatePipe('de-DE');
                cardFooterDes.forEach((cardFooterDe, index) => {
                    const lastModified = expectedComplexes[index].complex.respStatement.lastModified;
                    if (!expectedComplexes[index].disabled && lastModified !== '---') {
                        const pDes = getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 1, 1);
                        const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                        const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                        expectToBe(versionSpanEl.textContent.trim(), datePipe.transform(lastModified, 'longDate'));
                    }
                });
            });

            it('... should display "---" in span.version if complex is not disabled and lastModified is "---"', () => {
                const enabledComplex = expectedComplexes.find(
                    complexItem => !complexItem.disabled
                ) as EditionOutlineComplexItem;

                const expectedComplexWithoutLastModified = {
                    ...structuredClone(enabledComplex),
                    complex: {
                        ...structuredClone(enabledComplex.complex),
                        respStatement: {
                            ...structuredClone(enabledComplex.complex.respStatement),
                            lastModified: '---',
                        },
                    },
                } as unknown as EditionOutlineComplexItem;

                fixture.componentRef.setInput('displayedComplexes', [expectedComplexWithoutLastModified]);
                fixture.detectChanges();

                const pDes = getAndExpectDebugElementByCss(compDe, 'p.awg-edition-responsibility', 1, 1);
                const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                expectToBe(versionSpanEl.textContent.trim(), '---');
            });

            it('... should have text-end paragraph in div.card-footer for each complex', () => {
                const cardFooterDes = getCardFooterDes();
                cardFooterDes.forEach(cardFooterDe => {
                    getAndExpectDebugElementByCss(cardFooterDe, 'p.text-end', 1, 1);
                });
            });

            it('... should have a ButtonMoreComponent in text-end paragraph for each complex', () => {
                const pDes = getCardFooterParagraphDes();
                pDes.forEach(pDe => {
                    getAndExpectDebugElementByDirective(pDe, ButtonMoreComponent, 1, 1);
                });
            });

            it('... should pass down correct targetRoute to ButtonMoreComponent for each complex', () => {
                const pDes = getCardFooterParagraphDes();
                pDes.forEach((pDe, index) => {
                    const buttonMoreDes = getAndExpectDebugElementByDirective(pDe, ButtonMoreComponent, 1, 1);
                    const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                    expectToEqual(buttonMoreCmp.targetRoute(), [expectedComplexes[index].complex.baseRoute]);
                });
            });

            it('... should pass down correct disabled state to ButtonMoreComponent for each complex', () => {
                const pDes = getCardFooterParagraphDes();
                pDes.forEach((pDe, index) => {
                    const buttonMoreDes = getAndExpectDebugElementByDirective(pDe, ButtonMoreComponent, 1, 1);
                    const buttonMoreCmp = buttonMoreDes[0].injector.get(ButtonMoreComponent) as ButtonMoreComponent;

                    expectToBe(buttonMoreCmp.disabled(), expectedComplexes[index].disabled);
                });
            });
        });
    });
});
