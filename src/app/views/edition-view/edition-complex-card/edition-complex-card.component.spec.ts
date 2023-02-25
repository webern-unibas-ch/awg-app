import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EDITION_COMPLEXES } from '@awg-views/edition-view/data';
import { EditionOutlineComplex } from '@awg-views/edition-view/models';

import { EditionComplexCardComponent } from './edition-complex-card.component';

describe('EditionComplexCardComponent (DONE)', () => {
    let component: EditionComplexCardComponent;
    let fixture: ComponentFixture<EditionComplexCardComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedComplexes: EditionOutlineComplex[];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionComplexCardComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionComplexCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedComplexes = [
            { complex: EDITION_COMPLEXES.OP12, disabled: false },
            { complex: EDITION_COMPLEXES.OP23, disabled: false },
            { complex: EDITION_COMPLEXES.OP25, disabled: true },
            { complex: EDITION_COMPLEXES.M212, disabled: false },
            { complex: EDITION_COMPLEXES.M213, disabled: true },
        ];
    });

    it('should create', () => {
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
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                getAndExpectDebugElementByCss(rowDe[0], 'div.col', 0, 0);
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
            expect(component.complexes).toBeTruthy();
            expect(component.complexes).withContext(`should equal ${expectedComplexes}`).toEqual(expectedComplexes);
        });

        describe('VIEW', () => {
            it('... should have as many inner div.col as editionComplexes in outer div.row', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                getAndExpectDebugElementByCss(rowDe[0], 'div.col', expectedComplexes.length, expectedComplexes.length);
            });

            it('... should have as many inner div.card.awg-edition-card as editionComplexes', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach(col => {
                    getAndExpectDebugElementByCss(col, 'div.card.awg-edition-card', 1, 1);
                });
            });

            it('... should have as many inner div.card-body as editionComplexes', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach(col => {
                    const cardDe = getAndExpectDebugElementByCss(col, 'div.card.awg-edition-card', 1, 1);
                    getAndExpectDebugElementByCss(cardDe[0], 'div.card-body', 1, 1);
                });
            });

            it('... should have as many inner h5.card-title as editionComplexes', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach(col => {
                    const cardDe = getAndExpectDebugElementByCss(col, 'div.card.awg-edition-card', 1, 1);
                    const cardBodyDe = getAndExpectDebugElementByCss(cardDe[0], 'div.card-body', 1, 1);
                    getAndExpectDebugElementByCss(cardBodyDe[0], 'h5.card-title', 1, 1);
                });
            });

            it('... should text-mute card titles of disabled editionComplexes', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach((col, index) => {
                    const cardTitleDe = getAndExpectDebugElementByCss(col, 'h5.card-title', 1, 1);
                    const cardTitleEl = cardTitleDe[0].nativeElement;

                    expect(cardTitleEl.classList.contains('text-muted'))
                        .withContext(`should be ${expectedComplexes[index].disabled}`)
                        .toBe(expectedComplexes[index].disabled);
                });
            });

            it('... should display card titles in span.awg-edition-info-header-title', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach((col, index) => {
                    const cardTitleDe = getAndExpectDebugElementByCss(col, 'h5.card-title', 1, 1);
                    const headerDe = getAndExpectDebugElementByCss(
                        cardTitleDe[0],
                        'span.awg-edition-info-header-title',
                        1,
                        1
                    );
                    const headerEl = headerDe[0].nativeElement;

                    expect(headerEl.innerHTML).toBeTruthy();
                    expect(headerEl.innerHTML)
                        .withContext(`should be ${expectedComplexes[index].complex.titleStatement.title}`)
                        .toBe(expectedComplexes[index].complex.titleStatement.title);
                });
            });

            it('... should display catalogue number in span.awg-edition-info-header-catalogue', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach((col, index) => {
                    const cardTitleDe = getAndExpectDebugElementByCss(col, 'h5.card-title', 1, 1);
                    const headerDe = getAndExpectDebugElementByCss(
                        cardTitleDe[0],
                        'span.awg-edition-info-header-catalogue',
                        1,
                        1
                    );
                    const headerEl = headerDe[0].nativeElement;

                    expect(headerEl.textContent).toBeTruthy();
                    expect(headerEl.textContent)
                        .withContext(`should be ${expectedComplexes[index].complex.complexId.short}`)
                        .toBe(expectedComplexes[index].complex.complexId.short);
                });
            });

            it('... should have as many inner div.card-footer as editionComplexes', () => {
                const rowDe = getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
                const colDe = getAndExpectDebugElementByCss(
                    rowDe[0],
                    'div.col',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                colDe.forEach(col => {
                    const cardDe = getAndExpectDebugElementByCss(col, 'div.card.awg-edition-card', 1, 1);
                    getAndExpectDebugElementByCss(cardDe[0], 'div.card-footer', 1, 1);
                });
            });

            it('... should have edition responsibility statement in div.card-footer if complex is not disabled', () => {
                const cardFooterDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDe.forEach((cardFooter, index) => {
                    if (!expectedComplexes[index].disabled) {
                        getAndExpectDebugElementByCss(cardFooter, 'p.awg-edition-responsibility', 1, 1);
                    } else {
                        getAndExpectDebugElementByCss(cardFooter, 'p.awg-edition-responsibility', 0, 0);
                    }
                });
            });

            it('... should display as many editors in span.editor as there are editors', () => {
                const cardFooterDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDe.forEach((cardFooter, index) => {
                    if (!expectedComplexes[index].disabled) {
                        const pDe = getAndExpectDebugElementByCss(cardFooter, 'p.awg-edition-responsibility', 1, 1);
                        const editors = expectedComplexes[index].complex.responsibilityStatement.editors;
                        const editorDe = getAndExpectDebugElementByCss(
                            pDe[0],
                            'span.editor',
                            editors.length,
                            editors.length
                        );

                        editorDe.forEach((editor, editorIndex) => {
                            const editorEl = editor.nativeElement;

                            expect(editorEl.textContent).toBeTruthy();
                            expect(editorEl.textContent)
                                .withContext(`should equal ${editors[editorIndex].name}`)
                                .toEqual(editors[editorIndex].name);
                        });
                    }
                });
            });

            it('... should link to homepage of editors in span.editor', () => {
                const cardFooterDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDe.forEach((cardFooter, index) => {
                    if (!expectedComplexes[index].disabled) {
                        const pDe = getAndExpectDebugElementByCss(cardFooter, 'p.awg-edition-responsibility', 1, 1);
                        const editors = expectedComplexes[index].complex.responsibilityStatement.editors;
                        const editorDe = getAndExpectDebugElementByCss(
                            pDe[0],
                            'span.editor',
                            editors.length,
                            editors.length
                        );

                        editorDe.forEach((editor, editorIndex) => {
                            const anchorDe = getAndExpectDebugElementByCss(editor, 'a', 1, 1);
                            const anchorEl = anchorDe[0].nativeElement;

                            expect(anchorEl.href).toBeTruthy();
                            expect(anchorEl.href)
                                .withContext(`should equal ${editors[editorIndex].homepage}`)
                                .toEqual(editors[editorIndex].homepage);
                        });
                    }
                });
            });

            it('... should display version date in span.version if complex is not disabled', () => {
                const cardFooterDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDe.forEach((cardFooter, index) => {
                    if (!expectedComplexes[index].disabled) {
                        const pDe = getAndExpectDebugElementByCss(cardFooter, 'p.awg-edition-responsibility', 1, 1);
                        const versionDe = getAndExpectDebugElementByCss(pDe[0], 'span.version', 1, 1);
                        const versionEl = versionDe[0].nativeElement;

                        expect(versionEl.textContent).toBeTruthy();
                        expect(versionEl.textContent)
                            .withContext(
                                `should be ${expectedComplexes[index].complex.responsibilityStatement.lastModified}`
                            )
                            .toBe(expectedComplexes[index].complex.responsibilityStatement.lastModified);
                    } else {
                        getAndExpectDebugElementByCss(cardFooter, 'p.awg-edition-responsibility', 0, 0);
                        getAndExpectDebugElementByCss(cardFooter, 'span.version', 0, 0);
                    }
                });
            });

            it('... should have text-end paragraph in div.card-footer for each complex', () => {
                const cardFooterDe = getAndExpectDebugElementByCss(
                    compDe,
                    'div.card-footer',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                cardFooterDe.forEach(cardFooter => {
                    getAndExpectDebugElementByCss(cardFooter, 'p.text-end', 1, 1);
                });
            });

            it('... should have a link to complex in text-end paragraph for each complex', () => {
                const pDe = getAndExpectDebugElementByCss(
                    compDe,
                    'p.text-end',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                pDe.forEach(p => {
                    const linkDe = getAndExpectDebugElementByCss(p, 'a', 1, 1);
                    const linkEl = linkDe[0].nativeElement;

                    const expectedLinkText = 'Mehr...';

                    expect(linkEl.textContent).toBeTruthy();
                    expect(linkEl.textContent.trim())
                        .withContext(`should be ${expectedLinkText}`)
                        .toBe(expectedLinkText);
                });
            });

            it('... should disable links only for disabled editionComplexes', () => {
                const pDe = getAndExpectDebugElementByCss(
                    compDe,
                    'p.text-end',
                    expectedComplexes.length,
                    expectedComplexes.length
                );
                pDe.forEach((p, index) => {
                    const linkDe = getAndExpectDebugElementByCss(p, 'a', 1, 1);
                    const linkEl = linkDe[0].nativeElement;

                    expect(linkEl.classList.contains('disabled'))
                        .withContext(`should be ${expectedComplexes[index].disabled}`)
                        .toBe(expectedComplexes[index].disabled);
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
                expect(routerLinks.length)
                    .withContext(`should have ${expectedComplexes.length} routerLinks`)
                    .toBe(expectedComplexes.length);

                routerLinks.forEach((routerLink, index) => {
                    expect(routerLink.linkParams)
                        .withContext(`should equal ${expectedComplexes[index].complex.baseRoute}`)
                        .toEqual([expectedComplexes[index].complex.baseRoute]);
                });
            });

            it('... can click all links in template', () => {
                routerLinks.forEach((routerLink, index) => {
                    const linkDe = linkDes[index];
                    const expectedRouterLink = [expectedComplexes[index].complex.baseRoute];

                    expect(routerLink.navigatedTo).toBeNull();

                    click(linkDe);
                    fixture.detectChanges();

                    expect(routerLink.navigatedTo)
                        .withContext(`should equal ${expectedRouterLink}`)
                        .toEqual(expectedRouterLink);
                });
            });
        });
    });
});
