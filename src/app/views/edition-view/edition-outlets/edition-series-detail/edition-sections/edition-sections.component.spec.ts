import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Observable, of as observableOf } from 'rxjs';
import Spy = jasmine.Spy;

import { click } from '@testing/click-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { EditionOutlineSection, EditionOutlineSeries } from '@awg-views/edition-view/models';
import { EditionComplexesService, EditionOutlineService, EditionStateService } from '@awg-views/edition-view/services';

import { EditionSectionsComponent } from './edition-sections.component';

describe('EditionSectionsComponent (DONE)', () => {
    let component: EditionSectionsComponent;
    let fixture: ComponentFixture<EditionSectionsComponent>;
    let compDe: DebugElement;

    let mockEditionStateService: Partial<EditionStateService>;

    let clearSelectedSectionSpy: Spy;
    let getSeriesSpy: Spy;
    let editionStateServiceClearSelectedEditionSectionSpy: Spy;
    let editionStateServiceGetSelectedEditionSeriesSpy: Spy;

    let expectedSelectedSeries: EditionOutlineSeries;
    let expectedSelectedSection: EditionOutlineSection;

    beforeAll(() => {
        EditionComplexesService.initializeEditionComplexesList();
        EditionOutlineService.initializeEditionOutline();
    });

    beforeEach(waitForAsync(() => {
        // Mock edition state service
        mockEditionStateService = {
            getSelectedEditionSeries: (): Observable<EditionOutlineSeries> => observableOf(expectedSelectedSeries),
            clearSelectedEditionSection: (): void => {},
        };

        TestBed.configureTestingModule({
            declarations: [EditionSectionsComponent, RouterLinkStubDirective],
            providers: [{ provide: EditionStateService, useValue: mockEditionStateService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSectionsComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // TestData
        expectedSelectedSeries = EditionOutlineService.getEditionOutline()[0];
        expectedSelectedSection = expectedSelectedSeries.sections[4];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E

        clearSelectedSectionSpy = spyOn(component, 'clearSelectedSection').and.callThrough();
        getSeriesSpy = spyOn(component, 'getSeries').and.callThrough();
        editionStateServiceClearSelectedEditionSectionSpy = spyOn(
            mockEditionStateService,
            'clearSelectedEditionSection'
        ).and.callThrough();
        editionStateServiceGetSelectedEditionSeriesSpy = spyOn(
            mockEditionStateService,
            'getSelectedEditionSeries'
        ).and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `selectedSeries$`', () => {
            expect(component.selectedSeries$).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should not contain one div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            component.selectedSeries$ = observableOf(expectedSelectedSeries);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have `selectedSeries$`', () => {
            expect(component.selectedSeries$).toBeDefined();
        });

        it('...should trigger `clearSelectedSection` method on init', () => {
            expectSpyCall(clearSelectedSectionSpy, 1);
        });

        it('...should trigger `getSeries` method on init', () => {
            expectSpyCall(getSeriesSpy, 1);
        });

        describe('VIEW', () => {
            it('... should contain one div.row', () => {
                getAndExpectDebugElementByCss(compDe, 'div.row', 1, 1);
            });

            it('... should contain as many div.cols with div.card as sections', () => {
                const expectedSectionsLength = expectedSelectedSeries.sections.length;
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.col > div.card',
                    expectedSectionsLength,
                    expectedSectionsLength
                );
            });

            describe('... cover image', () => {
                it('... should contain one img.card-img-top in each div.card for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 1, 1);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });

                it('... should have correct src in img.card-img-top for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const imgDes = getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 1, 1);
                            const imgEl = imgDes[0].nativeElement;

                            const expectedSrc =
                                'assets/img/edition/series/' +
                                expectedSelectedSeries.series.route +
                                '/section/' +
                                expectedSection.section.route +
                                '/cover.jpg';

                            expectToContain(imgEl.src, expectedSrc);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });

                it('... should have correct alt in img.card-img-top for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const imgDes = getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 1, 1);
                            const imgEl = imgDes[0].nativeElement;

                            const expectedAlt = 'In Vorbereitung';

                            expectToBe(imgEl.alt, expectedAlt);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });

                it('... should have correct title in img.card-img-top for non-disabled sections', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const expectedSection = expectedSelectedSeries.sections[index];

                        if (!expectedSection.disabled) {
                            const imgDes = getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 1, 1);
                            const imgEl = imgDes[0].nativeElement;

                            const expectedTitle = `AWG ${expectedSelectedSeries.series.short}/${expectedSection.section.short}`;

                            expectToBe(imgEl.title, expectedTitle);
                        } else {
                            getAndExpectDebugElementByCss(cardDe, 'img.card-img-top', 0, 0);
                        }
                    });
                });
            });

            describe('... div.card-body', () => {
                it('... should contain one div.card-body in each div.card', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach(cardDe => {
                        getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                    });
                });

                it('... should contain one h5.card-title per section in div.card-body', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach(cardDe => {
                        const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                        const headerDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                        const headerEl = headerDes[0].nativeElement;

                        expect(headerEl.textContent).toBeDefined();
                    });
                });

                it('... should display the section title in h5.card-title', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                        const headerDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                        const headerEl = headerDes[0].nativeElement;

                        expectToBe(headerEl.textContent.trim(), expectedSelectedSeries.sections[index].section.full);
                    });
                });

                it('... should mute the section title only if the section is disabled', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach((cardDe, index) => {
                        const bodyDes = getAndExpectDebugElementByCss(cardDe, 'div.card-body', 1, 1);
                        const headerDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                        const headerEl = headerDes[0].nativeElement;

                        if (expectedSelectedSeries.sections[index].disabled) {
                            expectToContain(headerEl.classList, 'text-muted');
                        } else {
                            expect(headerEl.classList).not.toContain('text-muted');
                        }
                    });
                });
            });

            describe('... div.card-footer', () => {
                it('... should contain one div.card-footer in each div.card', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
                        expectedSectionsLength,
                        expectedSectionsLength
                    );

                    cardDes.forEach(cardDe => {
                        getAndExpectDebugElementByCss(cardDe, 'div.card-footer', 1, 1);
                    });
                });

                it('... should contain one routerLink per section in div.card-footer', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
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
                        'div.card',
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
                        'div.card',
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
                        const footerLinkEl = footerLinkDes[0].nativeElement;

                        const expectedLinkText = 'Mehr ...';

                        expectToEqual(footerLinkEl.textContent.trim(), expectedLinkText);
                    });
                });

                it('... should disable routerLink only if section is disabled', () => {
                    const expectedSectionsLength = expectedSelectedSeries.sections.length;

                    const cardDes = getAndExpectDebugElementByCss(
                        compDe,
                        'div.card',
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
                        const footerLinkEl = footerLinkDes[0].nativeElement;

                        if (expectedSection.disabled) {
                            expectToContain(footerLinkEl.classList, 'disabled');
                        } else {
                            expect(footerLinkEl.classList).not.toContain('disabled');
                        }
                    });
                });
            });
        });

        describe('#clearSelectedSection()', () => {
            it('... should have a method `clearSelectedSection`', () => {
                expect(component.clearSelectedSection).toBeDefined();
            });

            it('...should call `clearSelectedEditionSeries` from EditionStateService', () => {
                expectSpyCall(editionStateServiceClearSelectedEditionSectionSpy, 1);

                component.clearSelectedSection();

                expectSpyCall(editionStateServiceClearSelectedEditionSectionSpy, 2);
            });
        });

        describe('#getSeries()', () => {
            it('... should have a method `getSeries`', () => {
                expect(component.getSeries).toBeDefined();
            });

            it('...should call `getSelectedEditionSeries` from EditionStateService', () => {
                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 1);

                component.getSeries();

                expectSpyCall(editionStateServiceGetSelectedEditionSeriesSpy, 2);
            });

            it('...should set `selectedSeries$`', () => {
                component.selectedSeries$ = undefined;
                fixture.detectChanges();

                expect(component.selectedSeries$).toBeUndefined();

                component.getSeries();

                expect(component.selectedSeries$).toBeDefined();
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
                expectedSelectedSeries.sections.forEach((section, _sectionIndex) => {
                    if (!section.disabled) {
                        // Check the router link for the section
                        const expectedSectionLinkParams = [section.section.route];
                        expectToEqual(routerLinks[linkIndex++].linkParams, expectedSectionLinkParams);
                    }
                    linkIndex++;
                });
            });

            it('... can click section link in template', () => {
                const sectionLinkDe = linkDes[0];
                const sectionLink = routerLinks[0];

                expectToBe(sectionLink.navigatedTo, null);

                click(sectionLinkDe);
                fixture.detectChanges();

                expectToEqual(sectionLink.navigatedTo, [expectedSelectedSeries.sections[0].section.route]);
            });

            it('... should navigate to section page when section link is clicked', () => {
                const sectionLinkDe = linkDes[4];
                const sectionLink = routerLinks[4];

                expectToBe(sectionLink.navigatedTo, null);

                click(sectionLinkDe);
                fixture.detectChanges();

                expectToEqual(sectionLink.navigatedTo, [expectedSelectedSeries.sections[4].section.route]);
            });
        });
    });
});
