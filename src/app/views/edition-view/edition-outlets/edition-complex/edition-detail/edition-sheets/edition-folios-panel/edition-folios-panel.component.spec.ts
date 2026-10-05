import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { mockEditionData } from '@testing/mock-data';

import { ModalService } from '@awg-shared/modal/modal.service';

import { EditionSvgSheetId } from '@awg-views/edition-view/models/edition-svg-sheets.model';
import { FolioConvolute } from '@awg-views/edition-view/models/folio.model';
import { EditionNavigationService } from '@awg-views/edition-view/services/edition-navigation.service';

import { EditionFoliosPanelComponent } from './edition-folios-panel.component';
import { EditionFoliosLegendComponent } from './legend/edition-folios-legend.component';
import { EditionFoliosViewerComponent } from './viewer/edition-folios-viewer.component';

describe('EditionFoliosPanelComponent (DONE)', () => {
    let component: EditionFoliosPanelComponent;
    let fixture: ComponentFixture<EditionFoliosPanelComponent>;
    let compDe: DebugElement;

    let router: Router;
    let mockModalService: Partial<ModalService>;
    let mockNavigationService: Partial<EditionNavigationService>;

    let expectedConvolute: FolioConvolute;
    let expectedSheetId: EditionSvgSheetId;
    let expectedFragment: string;

    const getItemDe = (): DebugElement =>
        getAndExpectDebugElementByCss(compDe, 'div#awg-edition-folios-view.accordion-item', 1, 1)[0];
    const getBodyDe = (): DebugElement => getAndExpectDebugElementByCss(getItemDe(), 'div.accordion-body', 1, 1)[0];

    beforeEach(async () => {
        // Mocked services for the real EditionFoliosViewerSvgComponent
        mockModalService = {
            openTextModal: vi.fn(),
        };
        mockNavigationService = {
            navigateToSvgSheet: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [EditionFoliosPanelComponent],
            providers: [
                provideRouter([]),
                { provide: ModalService, useValue: mockModalService },
                { provide: EditionNavigationService, useValue: mockNavigationService },
            ],
        }).compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Inject services
        router = TestBed.inject(Router);

        // Test data
        expectedConvolute = structuredClone(mockEditionData.mockFolioConvoluteData.convolutes[0]);
        expectedSheetId = {
            id: mockEditionData.mockSvgSheet_Sk1.id,
            fullId: mockEditionData.mockSvgSheet_Sk1.id,
        };
        expectedFragment = `source_${expectedConvolute.convoluteId}`;

        // Create component fixture
        fixture = TestBed.createComponent(EditionFoliosPanelComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `selectedConvolute`', () => {
            expectToBe(isSignal(component.selectedConvolute), true);

            expect(() => component.selectedConvolute()).toThrow();
        });

        it('... should throw due to missing required input signal `selectedSheetId`', () => {
            expectToBe(isSignal(component.selectedSheetId), true);

            expect(() => component.selectedSheetId()).toThrow();
        });

        it('... should throw when accessing computed signal `reportFragment` due to missing input', () => {
            expectToBe(isSignal(component.reportFragment), true);

            expect(() => component.reportFragment()).toThrow();
        });

        it('... should throw when accessing computed signal `folios` due to missing input', () => {
            expectToBe(isSignal(component.folios), true);

            expect(() => component.folios()).toThrow();
        });

        describe('VIEW', () => {
            it('... should contain one div.accordion', () => {
                getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
            });

            it('... should contain one div.accordion-item with header and collapse in div.accordion', () => {
                const accordionDes = getAndExpectDebugElementByCss(compDe, 'div.accordion', 1, 1);
                const itemDes = getAndExpectDebugElementByCss(accordionDes[0], 'div.accordion-item', 1, 1);

                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-header', 1, 1);
                getAndExpectDebugElementByCss(itemDes[0], 'div.accordion-collapse', 1, 1);
            });

            it('... should contain the header title in the header button', () => {
                const buttonDes = getAndExpectDebugElementByCss(compDe, 'div.accordion-header button', 1, 1);

                expectToBe(buttonDes[0].nativeElement.textContent.trim(), 'Konvolutübersicht');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(async () => {
            // Simulate the parent setting the input properties
            fixture.componentRef.setInput('selectedConvolute', expectedConvolute);
            fixture.componentRef.setInput('selectedSheetId', expectedSheetId);

            // Trigger initial data binding
            await detectChangesOnPush(fixture);
        });

        it('... should have input signal `selectedConvolute` to hold the provided convolute', () => {
            expectToEqual(component.selectedConvolute(), expectedConvolute);
        });

        it('... should have input signal `selectedSheetId` to hold the provided sheet id', () => {
            expectToEqual(component.selectedSheetId(), expectedSheetId);
        });

        it('... should have computed signal `folios` to hold the folios of the selected convolute', () => {
            expectToEqual(component.folios(), expectedConvolute.folios);
        });

        it('... should have recomputed signal `folios` to hold an empty array for a convolute without folios', async () => {
            fixture.componentRef.setInput('selectedConvolute', {
                ...expectedConvolute,
                folios: undefined,
            } as unknown as FolioConvolute);
            await detectChangesOnPush(fixture);

            expectToEqual(component.folios(), []);
        });

        it('... should have computed signal `reportFragment` to hold the source fragment of the selected convolute', () => {
            expectToBe(component.reportFragment(), expectedFragment);
        });

        describe('VIEW', () => {
            it('... should open the body of div#awg-edition-folios-view', () => {
                const collapseDes = getAndExpectDebugElementByCss(
                    getItemDe(),
                    'div#awg-edition-folios-view-collapse',
                    1,
                    1
                );

                expectToContain(collapseDes[0].nativeElement.classList, 'show');
            });

            describe('... label', () => {
                it('... should contain one link with the convolute label in div.awg-edition-folios-panel-label', () => {
                    const labelDes = getAndExpectDebugElementByCss(
                        getBodyDe(),
                        'div.awg-edition-folios-panel-label',
                        1,
                        1
                    );
                    const linkDes = getAndExpectDebugElementByCss(labelDes[0], 'a', 1, 1);

                    expectToBe(linkDes[0].nativeElement.textContent.trim(), expectedConvolute.convoluteLabel);
                });
            });

            describe('... EditionFoliosViewerComponent', () => {
                it('... should contain one EditionFoliosViewerComponent in the body', () => {
                    getAndExpectDebugElementByDirective(getBodyDe(), EditionFoliosViewerComponent, 1, 1);
                });

                it('... should pass down `folios` and `selectedSheetId` to EditionFoliosViewerComponent', () => {
                    const viewerDes = getAndExpectDebugElementByDirective(
                        getBodyDe(),
                        EditionFoliosViewerComponent,
                        1,
                        1
                    );
                    const viewerCmp = viewerDes[0].injector.get(EditionFoliosViewerComponent);

                    expectToEqual(viewerCmp.folios(), expectedConvolute.folios);
                    expectToEqual(viewerCmp.selectedSheetId(), expectedSheetId);
                });
            });

            describe('... EditionFoliosLegendComponent', () => {
                it('... should contain one EditionFoliosLegendComponent with class `col-12` in the body', () => {
                    const legendDes = getAndExpectDebugElementByDirective(
                        getBodyDe(),
                        EditionFoliosLegendComponent,
                        1,
                        1
                    );

                    expectToContain(legendDes[0].nativeElement.classList, 'col-12');
                });
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];
            let expectedRouterLink: string;

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));

                expectedRouterLink = `/report#${expectedFragment}`;
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                const urlTreeString = routerLinks[0].urlTree?.toString() ?? '';

                expectToBe(urlTreeString, expectedRouterLink);
            });

            it('... can get correct fragment from template', () => {
                expectToBe(routerLinks[0].fragment, expectedFragment);
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

                const linkDe = linkDes[0];

                await clickAndAwaitChanges(linkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const actualUrl = navigateSpy.mock.calls[0][0].toString();

                expectToBe(actualUrl, expectedRouterLink);

                navigateSpy.mockRestore();
            });
        });
    });
});
