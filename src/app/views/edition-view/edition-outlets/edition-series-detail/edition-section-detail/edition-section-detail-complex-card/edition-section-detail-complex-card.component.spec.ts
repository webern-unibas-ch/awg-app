import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineComplexItem } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService } from '@awg-views/edition-view/services';

import { EditionSectionDetailComplexCardComponent } from './edition-section-detail-complex-card.component';

describe('EditionSectionDetailComplexCardComponent (DONE)', () => {
    let component: EditionSectionDetailComplexCardComponent;
    let fixture: ComponentFixture<EditionSectionDetailComplexCardComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedComplexes: EditionOutlineComplexItem[];

    beforeAll(() => {
        EditionOutlineService.initializeEditionOutline();
        EditionComplexesService.initializeEditionComplexesList();
        registerLocaleData(localeDeDE);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionDetailComplexCardComponent, RouterLinkStubDirective],
            imports: [DatePipe],
            providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSectionDetailComplexCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        const section = EditionOutlineService.getEditionSectionById('1', '5');

        expectedComplexes = section?.content.sectionComplexes ?? [];
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have complexes', () => {
            expect(component.complexes).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should have one outer div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should not have any inner div.col yet', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                getAndExpectDebugElementByCss(rowDes[0], 'div.col', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.complexes = expectedComplexes;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have complexes', () => {
            expectToEqual(component.complexes, expectedComplexes);
        });

        describe('VIEW', () => {
            it('... should have as many inner div.col as editionComplexes in outer div.row', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                getAndExpectDebugElementByCss(rowDes[0], 'div.col', expectedComplexes.length, expectedComplexes.length);
            });

            it('... should have as many inner div.card.awg-edition-card as editionComplexes', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDes.forEach(colDe => {
                    getAndExpectDebugElementByCss(colDe, 'div.card.awg-edition-card', 1, 1);
                });
            });

            it('... should have as many inner div.card-body as editionComplexes', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDes.forEach(colDe => {
                    const cardDes = getAndExpectDebugElementByCss(colDe, 'div.card.awg-edition-card', 1, 1);
                    getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);
                });
            });

            it('... should have as many inner h5.card-title as editionComplexes', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDes.forEach(colDe => {
                    const cardDes = getAndExpectDebugElementByCss(colDe, 'div.card.awg-edition-card', 1, 1);
                    const cardBodyDes = getAndExpectDebugElementByCss(cardDes[0], 'div.card-body', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDes[0], 'h5.card-title', 1, 1);
                });
            });

            it('... should text-mute card titles of disabled editionComplexes', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDes.forEach((colDe, index) => {
                    const cardTitleDes = getAndExpectDebugElementByCss(colDe, 'h5.card-title', 1, 1);
                    const cardTitleEl: HTMLHeadingElement = cardTitleDes[0].nativeElement;

                    if (expectedComplexes[index].disabled) {
                        expectToContain(cardTitleEl.classList, 'text-muted');
                    } else {
                        expectToNotContain(cardTitleEl.classList, 'text-muted');
                    }
                });
            });

            it('... should display complex as card title in span.awg-edition-info-header-title', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDes.forEach((colDe, index) => {
                    const cardTitleDes = getAndExpectDebugElementByCss(colDe, 'h5.card-title', 1, 1);
                    const titleSpanDes = getAndExpectDebugElementByCss(
                        cardTitleDes[0],
                        'span.awg-edition-info-header-title',
                        1,
                        1
                    );
                    const titleSpanEl: HTMLSpanElement = titleSpanDes[0].nativeElement;

                    expectToBe(titleSpanEl.innerHTML, expectedComplexes[index].complex.complexId.full);
                });
            });

            it('... should have as many inner div.card-footer as editionComplexes', () => {
                const rowDes = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDes = getAndExpectDebugElementByCss(
                    rowDes[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDes.forEach(colDe => {
                    const cardDes = getAndExpectDebugElementByCss(colDe, 'div.card.awg-edition-card', 1, 1);
                    getAndExpectDebugElementByCss(cardDes[0], 'div.card-footer', 1, 1);
                });
            });

            it('... should have edition responsibility statement in div.card-footer if complex is not disabled', () => {
                const cardFooterDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDes.forEach((cardFooterDe, index) => {
                    if (!expectedComplexes[index].disabled) {
                        getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 1, 1);
                    } else {
                        getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 0, 0);
                    }
                });
            });

            it('... should display as many editors in span.editor as there are editors', () => {
                const cardFooterDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
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
                const cardFooterDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
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

            it('... should display formatted date in span.version if complex is not disabled and lastModified is an ISO date', () => {
                const cardFooterDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
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
                const cardFooterDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDes.forEach((cardFooterDe, index) => {
                    const lastModified = expectedComplexes[index].complex.respStatement.lastModified;
                    if (!expectedComplexes[index].disabled && lastModified === '---') {
                        const pDes = getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 1, 1);
                        const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                        const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                        expectToBe(versionSpanEl.textContent.trim(), '---');
                    } else if (expectedComplexes[index].disabled) {
                        getAndExpectDebugElementByCss(cardFooterDe, 'p.awg-edition-responsibility', 0, 0);
                        getAndExpectDebugElementByCss(cardFooterDe, 'span.version', 0, 0);
                    }
                });
            });

            it('... should have text-end paragraph in div.card-footer for each complex', () => {
                const cardFooterDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDes.forEach(cardFooterDe => {
                    getAndExpectDebugElementByCss(cardFooterDe, 'p.text-end', 1, 1);
                });
            });

            it('... should have a link to complex in text-end paragraph for each complex', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.text-end',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                pDes.forEach(pDe => {
                    const aDes = getAndExpectDebugElementByCss(pDe, 'a', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    const expectedLinkText = 'Mehr ...';

                    expectToBe(aEl.textContent.trim(), expectedLinkText);
                });
            });

            it('... should disable links only for disabled editionComplexes', () => {
                const pDes = getAndExpectDebugElementByCss(
                    compDe,
                    'p.text-end',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                pDes.forEach((pDe, index) => {
                    const aDes = getAndExpectDebugElementByCss(pDe, 'a', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    if (expectedComplexes[index].disabled) {
                        expectToContain(aEl.classList, 'disabled');
                    } else {
                        expectToNotContain(aEl.classList, 'disabled');
                    }
                });
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(
                    compDe,
                    RouterLinkStubDirective,
                    expectedComplexes.length,
                    expectedComplexes.length
                );

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLinks from template', () => {
                expectToBe(routerLinks.length, expectedComplexes.length);

                for (const [index, routerLink] of routerLinks.entries()) {
                    expectToEqual(routerLink.linkParams, [expectedComplexes[index].complex.baseRoute]);
                }
            });

            it('... can click all links in template', async () => {
                for (const [index, routerLink] of routerLinks.entries()) {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = [expectedComplexes[index].complex.baseRoute];

                    expectToBe(routerLink.navigatedTo, null);

                    await clickAndAwaitChanges(linkDe, fixture);

                    expectToEqual(routerLink.navigatedTo, expectedRouterLink);
                }
            });
        });
    });
});
