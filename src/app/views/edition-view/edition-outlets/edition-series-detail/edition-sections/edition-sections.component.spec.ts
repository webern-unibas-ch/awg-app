import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe, expect, it } from 'vitest';

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

import { EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionsComponent } from './edition-sections.component';

describe('EditionSectionsComponent (DONE)', () => {
    let component: EditionSectionsComponent;
    let fixture: ComponentFixture<EditionSectionsComponent>;
    let compDe: DebugElement;

    let editionOutlineService: EditionOutlineService;
    let editionStateService: EditionStateService;

    let expectedSelectedSeries: EditionOutlineSeries;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditionSectionsComponent, RouterLinkStubDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionOutlineService = TestBed.inject(EditionOutlineService);
        editionStateService = TestBed.inject(EditionStateService);

        // Init edition data
        editionOutlineService.initializeEditionOutline();

        // Test data
        expectedSelectedSeries = editionOutlineService.editionOutline()[0];

        // Create component fixture
        fixture = TestBed.createComponent(EditionSectionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have signal `selectedSeries` to hold null', () => {
            expectToEqual(component.selectedSeries(), null);
        });

        describe('VIEW', () => {
            it('... should not contain one div.awg-edition-sections-grid yet', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sections-grid', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            editionStateService.updateSelectedEditionSeries(expectedSelectedSeries);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have signal `selectedSeries` to hold the expected series', () => {
            expectToEqual(component.selectedSeries(), expectedSelectedSeries);
        });

        describe('VIEW', () => {
            it('... should contain one div.awg-edition-sections-grid', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-edition-sections-grid', 1, 1);
            });

            it('... should contain as many div.cols with div.awg-edition-section-card as sections', () => {
                const expectedSectionsLength = expectedSelectedSeries.sections.length;
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.col > div.awg-edition-section-card',
                    expectedSectionsLength,
                    expectedSectionsLength
                );
            });

            it('... should contain one div.row in each div.awg-edition-section-card', () => {
                const expectedSectionsLength = expectedSelectedSeries.sections.length;

                const cardDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-edition-section-card',
                    expectedSectionsLength,
                    expectedSectionsLength
                );

                cardDes.forEach(cardDe => {
                    getAndExpectDebugElementByCss(cardDe, 'div.row', 1, 1);
                });
            });

            describe('... cover image', () => {
                it('... should contain one div.awg-img-container in each div.awg-edition-section-card for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 1, 1);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 0, 0);
                        }
                    });
                });

                it('... should contain one img.card-img-top in each div.awg-img-container for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const containerDes = getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 1, 1);
                            getAndExpectDebugElementByCss(containerDes[0], 'img.card-img-top', 1, 1);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 0, 0);
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });

                it('... should have correct src in img.card-img-top for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const containerDes = getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 1, 1);
                            const imgDes = getAndExpectDebugElementByCss(containerDes[0], 'img.card-img-top', 1, 1);
                            const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                            const expectedSrc =
                                'assets/img/edition/series/' +
                                expectedSelectedSeries.series.route +
                                '/section/' +
                                expectedSection.section.route +
                                '/cover.jpg';

                            expectToContain(imgEl.src, expectedSrc);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 0, 0);
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });

                it('... should have correct alt in img.card-img-top for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const containerDes = getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 1, 1);
                            const imgDes = getAndExpectDebugElementByCss(containerDes[0], 'img.card-img-top', 1, 1);
                            const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                            const expectedAlt = 'In Vorbereitung';

                            expectToBe(imgEl.alt, expectedAlt);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 0, 0);
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });

                it('... should have correct title in img.card-img-top for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const containerDes = getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 1, 1);
                            const imgDes = getAndExpectDebugElementByCss(containerDes[0], 'img.card-img-top', 1, 1);
                            const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                            const expectedTitle = `AWG ${expectedSelectedSeries.series.short}/${expectedSection.section.short}`;

                            expectToBe(imgEl.title, expectedTitle);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'div.awg-img-container', 0, 0);
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });
            });

            describe('... div.awg-edition-section-card-content', () => {
                it('... should contain one div.awg-edition-section-card-content in each div.awg-edition-section-card', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach(cardDe => {
                        getAndExpectDebugElementByCss(cardDe, 'div.awg-edition-section-card-content', 1, 1);
                    });
                });

                it('... should have class `col-8 col-sm-10` on div.awg-edition-section-card-content if section is not disabled', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        const contentDes = getAndExpectDebugElementByCss(
                            cardDe,
                            'div.awg-edition-section-card-content',
                            1,
                            1
                        );
                        const contentEl: HTMLDivElement = contentDes[0].nativeElement;

                        if (!expectedSection.disabled) {
                            expectToContain(contentEl.classList, 'col-8');
                            expectToContain(contentEl.classList, 'col-sm-10');
                        } else {
                            expectToNotContain(contentEl.classList, 'col-8');
                            expectToNotContain(contentEl.classList, 'col-sm-10');
                        }
                    });
                });

                it('... should contain one div.card-body in each div.card', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach(cardDe => {
                        const contentDes = getAndExpectDebugElementByCss(
                            cardDe,
                            'div.awg-edition-section-card-content',
                            1,
                            1
                        );
                        getAndExpectDebugElementByCss(contentDes[0], 'div.card-body', 1, 1);
                    });
                });

                it('... should contain one div.card-footer in each div.card', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-edition-section-card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach(cardDe => {
                        const contentDes = getAndExpectDebugElementByCss(
                            cardDe,
                            'div.awg-edition-section-card-content',
                            1,
                            1
                        );
                        getAndExpectDebugElementByCss(contentDes[0], 'div.card-footer', 1, 1);
                    });
                });

                describe('... div.card-body', () => {
                    it('... should add a top border if section is not disabled', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach((cardDe, index) => {
                            const expectedSection = expectedSelectedSeries.sections[index];

                            const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                            const bodyEl: HTMLDivElement = bodyDes[0].nativeElement;

                            if (!expectedSection.disabled) {
                                expectToContain(bodyEl.classList, 'awg-card-border-top');
                            } else {
                                expectToNotContain(bodyEl.classList, 'awg-card-border-top');
                            }
                        });
                    });

                    it('... should contain one h5.card-title per section in div.card-body', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach(cardDe => {
                            const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                            const hDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            expect(hEl.textContent).toBeDefined();
                        });
                    });

                    it('... should display the section title in h5.card-title', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach((cardDe, index) => {
                            const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                            const hDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            expectToBe(hEl.textContent.trim(), expectedSelectedSeries.sections[index].section.full);
                        });
                    });

                    it('... should mute the section title only if the section is disabled', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach((cardDe, index) => {
                            const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                            const hDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                            if (expectedSelectedSeries.sections[index].disabled) {
                                expectToContain(hEl.classList, 'text-muted');
                            } else {
                                expectToNotContain(hEl.classList, 'text-muted');
                            }
                        });
                    });
                });

                describe('... div.card-footer', () => {
                    it('... should contain one routerLink per section in div.card-footer', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach(cardDe => {
                            const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                            getAndExpectDebugElementByDirective(footerDes[0], RouterLinkStubDirective, 1, 1);
                        });
                    });

                    it('... should have correct routerLink in each div.card-footer', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach((cardDe, index) => {
                            const expectedSection = expectedSelectedSeries.sections[index].section;

                            const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                            const footerLinkDes = getAndExpectDebugElementByDirective(
                                footerDes[0],
                                RouterLinkStubDirective,
                                1,
                                1
                            );
                            const footerLink = footerLinkDes[0].injector.get(RouterLinkStubDirective);

                            const expectedLinkParams = [expectedSection.route];

                            expectToEqual(footerLink.linkParams, expectedLinkParams);
                        });
                    });

                    it('... should display correct text in each routerLink in div.card-footer', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach(cardDe => {
                            const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                            const footerLinkDes = getAndExpectDebugElementByDirective(
                                footerDes[0],
                                RouterLinkStubDirective,
                                1,
                                1
                            );
                            const footerLinkEl: HTMLAnchorElement = footerLinkDes[0].nativeElement;

                            const expectedLinkText = 'Mehr ...';

                            expectToEqual(footerLinkEl.textContent.trim(), expectedLinkText);
                        });
                    });

                    it('... should disable routerLink only if section is disabled', () => {
                        const expectedSectionsLength = expectedSelectedSeries.sections.length;

                        const cardDes = getAndExpectDebugElementByCss(
                            compDe,
                            'div.awg-edition-section-card',
                            expectedSectionsLength,
                            expectedSectionsLength
                        );

                        cardDes.forEach((cardDe, index) => {
                            const expectedSection = expectedSelectedSeries.sections[index];

                            const footerDes = getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                            const footerLinkDes = getAndExpectDebugElementByDirective(
                                footerDes[0],
                                RouterLinkStubDirective,
                                1,
                                1
                            );
                            const footerLinkEl: HTMLAnchorElement = footerLinkDes[0].nativeElement;

                            if (expectedSection.disabled) {
                                expectToContain(footerLinkEl.classList, 'disabled');
                            } else {
                                expectToNotContain(footerLinkEl.classList, 'disabled');
                            }
                        });
                    });
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: string | any[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 5, 5);

                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                const expectedSectionsLength = expectedSelectedSeries.sections.length;

                expectToBe(routerLinks.length, expectedSectionsLength);
            });

            it('... can get correct linkParams from template', () => {
                let linkIndex = 0;
                expectedSelectedSeries.sections.forEach(section => {
                    if (!section.disabled) {
                        // Check the router link for the section
                        const expectedSectionLinkParams = [section.section.route];
                        expectToEqual(routerLinks[linkIndex++].linkParams, expectedSectionLinkParams);
                    }
                    linkIndex++;
                });
            });

            it('... can click section link in template', async () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expectToBe(sectionLink.navigatedTo, null);

                await clickAndAwaitChanges(sectionLinkDe, fixture);

                expectToEqual(sectionLink.navigatedTo, [expectedSelectedSeries.sections[0].section.route]);
            });

            it('... should navigate to section page when section link is clicked', async () => {
                const sectionLinkDe = linkDes[4];
                const sectionLink = routerLinks[4];

                expectToBe(sectionLink.navigatedTo, null);

                await clickAndAwaitChanges(sectionLinkDe, fixture);

                expectToEqual(sectionLink.navigatedTo, [expectedSelectedSeries.sections[4].section.route]);
            });
        });
    });
});
