import { DatePipe, registerLocaleData } from '@angular/common';
import localeDeDE from '@angular/common/locales/de';
import { Component, DebugElement, input, Input, isSignal, LOCALE_ID, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '@testing/router-stubs';

import { MetaIdentifiers } from '@awg-shared/meta/meta.model';
import { LabeledRoute } from '@awg-shared/models/labeled-route.model';

import { EDITION_ROUTE_CONSTANTS } from './edition-routes.constants';
import { EditionComplex } from './models/edition-complex.model';
import { EditionViewContext } from './models/edition-data.model';
import { EditionBreadcrumbService } from './services/edition-breadcrumb.service';
import { EditionComplexesService } from './services/edition-complexes.service';
import { EditionStateService } from './services/edition-state.service';
import { EditionViewService } from './services/edition-view.service';

import { EditionViewComponent } from './edition-view.component';

registerLocaleData(localeDeDE);

// Mock components
@Component({
    selector: 'awg-scroll-to-top-button',
    template: '',
})
class ScrollToTopButtonStubComponent {}

@Component({
    selector: 'awg-edition-breadcrumb',
    template: '',
})
class EditionBreadcrumbStubComponent {
    readonly items = input.required<LabeledRoute[]>();
}

@Component({
    selector: 'awg-edition-jumbotron',
    template: '',
    standalone: false,
})
class EditionJumbotronStubComponent {
    @Input()
    jumbotronId: string;
    @Input()
    jumbotronTitle: string;
}

@Component({
    selector: 'awg-meta-identifier-badges',
    template: '',
    standalone: false,
})
class MetaIdentifierBadgesStubComponent {
    @Input()
    identifiers: MetaIdentifiers | undefined;
}

describe('EditionViewComponent (DONE)', () => {
    let component: EditionViewComponent;
    let fixture: ComponentFixture<EditionViewComponent>;
    let compDe: DebugElement;

    let editionComplexesService: EditionComplexesService;
    let editionStateService: EditionStateService;

    let getBreadcrumbItemsSpy: Spy;

    let mockViewContextSignal: WritableSignal<EditionViewContext>;
    let mockBreadcrumbItemsSignal: WritableSignal<LabeledRoute[]>;

    let expectedDefaultViewContext: EditionViewContext;
    let expectedIntroViewContext: EditionViewContext;
    let expectedPrefaceViewContext: EditionViewContext;
    let expectedRowtablesViewContext: EditionViewContext;
    let expectedSelectedEditionComplexId: string;
    let expectedSelectedEditionComplex: EditionComplex;

    const expectedTitle = 'Editionsübersicht';
    const expectedId = 'awg-edition-view';

    beforeEach(async () => {
        // Mock services
        expectedDefaultViewContext = { name: 'other-name', isIntro: false, isPreface: false, isRowtables: false };
        mockViewContextSignal = signal(expectedDefaultViewContext);

        mockBreadcrumbItemsSignal = signal<LabeledRoute[]>([]);

        await TestBed.configureTestingModule({
            imports: [DatePipe, EditionBreadcrumbStubComponent, ScrollToTopButtonStubComponent],
            declarations: [
                EditionViewComponent,
                EditionJumbotronStubComponent,
                MetaIdentifierBadgesStubComponent,
                RouterOutletStubComponent,
                RouterLinkStubDirective,
            ],
            providers: [
                { provide: LOCALE_ID, useValue: 'de-DE' },
                { provide: EditionViewService, useValue: { viewContext: mockViewContextSignal.asReadonly() } },
                {
                    provide: EditionBreadcrumbService,
                    useValue: { getBreadcrumbItems: () => mockBreadcrumbItemsSignal.asReadonly() },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject services
        editionComplexesService = TestBed.inject(EditionComplexesService);
        editionStateService = TestBed.inject(EditionStateService);
        const breadcrumbService = TestBed.inject(EditionBreadcrumbService);

        // Init edition data
        editionComplexesService.initializeEditionComplexesList();

        // Spies
        getBreadcrumbItemsSpy = vi.spyOn(breadcrumbService, 'getBreadcrumbItems');

        // Test data
        expectedIntroViewContext = { name: 'intro', isIntro: true, isPreface: false, isRowtables: false };
        expectedPrefaceViewContext = { name: 'preface', isIntro: false, isPreface: true, isRowtables: false };
        expectedRowtablesViewContext = { name: 'rowtables', isIntro: false, isPreface: false, isRowtables: true };
        expectedSelectedEditionComplexId = 'op12';
        expectedSelectedEditionComplex = editionComplexesService.getEditionComplexById(
            expectedSelectedEditionComplexId
        );

        // Create component fixture
        fixture = TestBed.createComponent(EditionViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have `id` and `title`', () => {
            expectToBe(component.EDITION_VIEW_ID, expectedId);
            expectToBe(component.EDITION_VIEW_TITLE, expectedTitle);
        });

        it('... should have signal `selectedEditionSeries` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionSeries), true);

            expectToBe(component.selectedEditionSeries(), null);
        });

        it('... should have signal `selectedEditionSection` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionSection), true);

            expectToBe(component.selectedEditionSection(), null);
        });

        it('... should have signal `selectedEditionComplex` to hold null', () => {
            expectToBe(isSignal(component.selectedEditionComplex), true);

            expectToBe(component.selectedEditionComplex(), null);
        });

        it('... should have signal `viewContext` to hold the default view context', () => {
            expectToBe(isSignal(component.viewContext), true);

            expectToEqual(component.viewContext(), expectedDefaultViewContext);
        });

        it('... should have signal `jumbotronTitle` to hold the default title', () => {
            expectToBe(isSignal(component.jumbotronTitle), true);

            expectToBe(component.jumbotronTitle(), expectedTitle);
        });

        describe('VIEW', () => {
            const getEditionViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-view', 1, 1);

            it('... should contain one `div.awg-edition-view`', () => {
                getEditionViewDes();
            });

            it('... should contain one ScrollToTop component (stubbed) in `div.awg-edition-view`', () => {
                getAndExpectDebugElementByDirective(getEditionViewDes()[0], ScrollToTopButtonStubComponent, 1, 1);
            });

            describe('... should contain no sub-components yet', () => {
                it.each([
                    { desc: '`div.awg-edition-preface`', selector: 'div.awg-edition-preface' },
                    { desc: '`div.awg-edition-rowtables`', selector: 'div.awg-edition-rowtables' },
                    { desc: '`div.awg-edition-complex`', selector: 'div.awg-edition-complex' },
                    { desc: '`div.awg-edition-series`', selector: 'div.awg-edition-series' },
                ])('... should contain no $desc in `div.awg-edition-view` yet', ({ selector }) => {
                    getAndExpectDebugElementByCss(getEditionViewDes()[0], selector, 0, 0);
                });
            });

            it('... should contain one router outlet (stubbed) in `div.awg-edition-view`', () => {
                getAndExpectDebugElementByDirective(getEditionViewDes()[0], RouterOutletStubComponent, 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#breadcrumbItems()', () => {
            it('... should have a signal `breadcrumbItems`', () => {
                expect(component.breadcrumbItems).toBeDefined();

                expectToBe(isSignal(component.breadcrumbItems), true);
            });

            it('... should have triggered the breadcrumb service to get the items for the breadcrumb', () => {
                component.breadcrumbItems();

                expectSpyCall(getBreadcrumbItemsSpy, 1, [
                    component.viewContext,
                    component.selectedEditionComplex,
                    component.selectedEditionSeries,
                    component.selectedEditionSection,
                ]);
            });

            it('... should return the items from the breadcrumb service', () => {
                const expectedBreadcrumbs: LabeledRoute[] = [
                    { label: 'Edition', route: ['/edition'] },
                    { label: 'Serie', route: [] },
                ];
                mockBreadcrumbItemsSignal.set(expectedBreadcrumbs);

                const actualBreadcrumbs = component.breadcrumbItems();

                expectToBe(actualBreadcrumbs.length, 2);
                expectToEqual(actualBreadcrumbs, expectedBreadcrumbs);
            });
        });

        describe('#jumbotronTitle()', () => {
            it('... should have a signal `jumbotronTitle`', () => {
                expect(component.jumbotronTitle).toBeDefined();
                expectToBe(isSignal(component.jumbotronTitle), true);
            });

            it.each([
                {
                    desc: 'preface title if viewContext is preface',
                    context: () => expectedPrefaceViewContext,
                    expected: () => EDITION_ROUTE_CONSTANTS.PREFACE.full,
                },
                {
                    desc: 'rowtables title if viewContext is rowtables',
                    context: () => expectedRowtablesViewContext,
                    expected: () => 'Übersicht',
                },
                {
                    desc: 'complex title if a complex is selected and no special view is active',
                    context: () => expectedDefaultViewContext,
                    expected: () => expectedSelectedEditionComplex.complexId.full,
                    setup: () => editionStateService.updateSelectedEditionComplex(expectedSelectedEditionComplex),
                },
                {
                    desc: 'intro title if viewContext is intro',
                    context: () => expectedIntroViewContext,
                    expected: () => EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full,
                },
                {
                    desc: 'EDITION_VIEW_TITLE as default',
                    context: () => expectedDefaultViewContext,
                    expected: () => expectedTitle,
                    setup: () => editionStateService.updateSelectedEditionComplex(null),
                },
            ])('... should hold $desc', ({ context, expected, setup }) => {
                if (setup) {
                    setup();
                }

                mockViewContextSignal.set(context());

                expectToBe(component.jumbotronTitle(), expected());
            });
        });

        describe('VIEW', () => {
            const getEditionViewDes = () => getAndExpectDebugElementByCss(compDe, 'div.awg-edition-view', 1, 1);
            const getPrefaceDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-preface', 1, 1);
            const getRowtableDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-rowtables', 1, 1);
            const getComplexDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-complex', 1, 1);
            const getSeriesDes = () =>
                getAndExpectDebugElementByCss(getEditionViewDes()[0], 'div.awg-edition-series', 1, 1);

            describe('... if `viewContext` is preface', () => {
                beforeEach(() => {
                    mockViewContextSignal.set(expectedPrefaceViewContext);

                    // Trigger data binding
                    fixture.detectChanges();
                });

                it('... should have signal `viewContext` to hold true for preface view', () => {
                    expectToEqual(component.viewContext(), expectedPrefaceViewContext);
                });

                it('... should have signal `jumbotronTitle` to hold the preface title', () => {
                    expectToBe(component.jumbotronTitle(), EDITION_ROUTE_CONSTANTS.PREFACE.full);
                });

                it('... should have one `div.awg-edition-preface` in `div.awg-edition-view`', () => {
                    getPrefaceDes();
                });

                it('... should have a BreadcrumbComponent (stubbed) and a JumbotronComponent (stubbed) in `div.awg-edition-preface`', () => {
                    const prefaceDes = getPrefaceDes();

                    getAndExpectDebugElementByDirective(prefaceDes[0], EditionBreadcrumbStubComponent, 1, 1);
                    getAndExpectDebugElementByDirective(prefaceDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should pass down `breadcrumbItems` to BreadcrumbComponent (stubbed)', () => {
                    const breadcrumbDes = getAndExpectDebugElementByDirective(
                        getPrefaceDes()[0],
                        EditionBreadcrumbStubComponent,
                        1,
                        1
                    );
                    const breadcrumbCmp = breadcrumbDes[0].injector.get(
                        EditionBreadcrumbStubComponent
                    ) as EditionBreadcrumbStubComponent;

                    expectToEqual(breadcrumbCmp.items(), component.breadcrumbItems());
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getPrefaceDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, EDITION_ROUTE_CONSTANTS.PREFACE.full);
                });
            });

            describe('... if `viewContext` is rowtables', () => {
                beforeEach(() => {
                    mockViewContextSignal.set(expectedRowtablesViewContext);

                    // Trigger data binding
                    fixture.detectChanges();
                });

                it('... should have signal `viewContext` to hold true for rowtables view', () => {
                    expectToEqual(component.viewContext(), expectedRowtablesViewContext);
                });

                it('... should have signal `jumbotronTitle` to hold the rowtables title', () => {
                    expectToBe(component.jumbotronTitle(), 'Übersicht');
                });

                it('... should have one `div.awg-edition-rowtables` in `div.awg-edition-view`', () => {
                    getRowtableDes();
                });

                it('... should have BreadcrumbComponent (stubbed) and a JumbotronComponent (stubbed) in `div.awg-edition-rowtables`', () => {
                    const rowtableDes = getRowtableDes();

                    getAndExpectDebugElementByDirective(rowtableDes[0], EditionBreadcrumbStubComponent, 1, 1);
                    getAndExpectDebugElementByDirective(rowtableDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should pass down `breadcrumbItems` to BreadcrumbComponent (stubbed)', () => {
                    const breadcrumbDes = getAndExpectDebugElementByDirective(
                        getRowtableDes()[0],
                        EditionBreadcrumbStubComponent,
                        1,
                        1
                    );
                    const breadcrumbCmp = breadcrumbDes[0].injector.get(
                        EditionBreadcrumbStubComponent
                    ) as EditionBreadcrumbStubComponent;

                    expectToEqual(breadcrumbCmp.items(), component.breadcrumbItems());
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getRowtableDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, 'Übersicht');
                });
            });

            describe('... if `selectedEditionComplex` is given', () => {
                const renderSelectedEditionComplex = (complex: EditionComplex): void => {
                    editionStateService.updateSelectedEditionComplex(complex);
                    mockViewContextSignal.set(expectedDefaultViewContext);

                    fixture.detectChanges();
                };

                beforeEach(() => {
                    renderSelectedEditionComplex(expectedSelectedEditionComplex);
                });

                it('... should have signal `selectedEditionComplex` to hold the expected complex', () => {
                    expectToBe(component.selectedEditionComplex(), expectedSelectedEditionComplex);
                });

                it('... should have signal `viewContext` to hold the default view context', () => {
                    expectToEqual(component.viewContext(), expectedDefaultViewContext);
                });

                it('... should have signal `jumbotronTitle` to hold the expected complex title', () => {
                    expectToBe(component.jumbotronTitle(), expectedSelectedEditionComplex.complexId.full);
                });

                it('... should still have signal `jumbotronTitle` to hold the expected complex title if `viewContext` is intro', () => {
                    mockViewContextSignal.set(expectedIntroViewContext);

                    fixture.detectChanges();

                    expectToBe(component.jumbotronTitle(), expectedSelectedEditionComplex.complexId.full);
                });

                it('... should have one `div.awg-edition-complex` in `div.awg-edition-view`', () => {
                    getComplexDes();
                });

                it('... should have a BreadcrumbComponent (stubbed), a JumbotronComponent (stubbed) and a responsibility div in `div.awg-edition-complex`', () => {
                    const complexDes = getComplexDes();

                    getAndExpectDebugElementByDirective(complexDes[0], EditionBreadcrumbStubComponent, 1, 1);
                    getAndExpectDebugElementByDirective(complexDes[0], EditionJumbotronStubComponent, 1, 1);
                    getAndExpectDebugElementByCss(complexDes[0], 'div.awg-edition-responsibility', 1, 1);
                });

                it('... should pass down `breadcrumbItems` to BreadcrumbComponent (stubbed)', () => {
                    const breadcrumbDes = getAndExpectDebugElementByDirective(
                        getComplexDes()[0],
                        EditionBreadcrumbStubComponent,
                        1,
                        1
                    );
                    const breadcrumbCmp = breadcrumbDes[0].injector.get(
                        EditionBreadcrumbStubComponent
                    ) as EditionBreadcrumbStubComponent;

                    expectToEqual(breadcrumbCmp.items(), component.breadcrumbItems());
                });

                it('... should pass down `editionViewId` and `title` to JumbotronComponent (stubbed)', () => {
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getComplexDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, expectedSelectedEditionComplex.complexId.full);
                });

                it('... should have one paragraph with editor and version in responsibility div', () => {
                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const editors = expectedSelectedEditionComplex.respStatement.editors;

                    getAndExpectDebugElementByCss(pDes[0], 'span.editor', editors.length, editors.length);
                    getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                });

                it('... should display editor link and version in responsibility div', () => {
                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);

                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;
                    const editorLinkDes = getAndExpectDebugElementByCss(
                        pDes[0],
                        'span.editor > a',
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);

                    const editorLinkEls: HTMLAnchorElement[] = editorLinkDes.map(editor => editor.nativeElement);
                    const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                    editorLinkEls.forEach((editorLinkEl, i: number) => {
                        expectToBe(editorLinkEl.href, expectedEditors[i].homepage);

                        expectToBe(editorLinkEl.textContent?.trim(), expectedEditors[i].name);
                    });

                    const datePipe = new DatePipe('de-DE');
                    const expectedLastModified = datePipe.transform(
                        expectedSelectedEditionComplex.respStatement.lastModified,
                        'longDate'
                    );
                    expectToBe(versionSpanEl.textContent?.trim(), expectedLastModified);
                });

                it('... should display "---" in span.version without applying DatePipe when lastModified is "---"', () => {
                    const expectedComplexWithDash = editionComplexesService.getEditionComplexById('m212');
                    renderSelectedEditionComplex(expectedComplexWithDash);

                    const pDes = getAndExpectDebugElementByCss(compDe, 'div.awg-edition-responsibility > p', 1, 1);
                    const versionSpanDes = getAndExpectDebugElementByCss(pDes[0], 'span.version', 1, 1);
                    const versionSpanEl: HTMLSpanElement = versionSpanDes[0].nativeElement;

                    expectToBe(versionSpanEl.textContent?.trim(), '---');
                });

                it('... should have one MetaIdentifierBadgesComponent for each editor', () => {
                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;

                    const badgeDes = getAndExpectDebugElementByDirective(
                        compDe,
                        MetaIdentifierBadgesStubComponent,
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const badgeCmps = badgeDes.map(de => de.injector.get(MetaIdentifierBadgesStubComponent));

                    expectToEqual(badgeCmps.length, expectedEditors.length);
                });

                it('... should pass identifiers to MetaIdentifierBadgesComponent for each editor', () => {
                    const expectedEditors = expectedSelectedEditionComplex.respStatement.editors;

                    const badgeDes = getAndExpectDebugElementByDirective(
                        compDe,
                        MetaIdentifierBadgesStubComponent,
                        expectedEditors.length,
                        expectedEditors.length
                    );
                    const badgeCmps = badgeDes.map(de => de.injector.get(MetaIdentifierBadgesStubComponent));

                    badgeCmps.forEach((badgeCmp, i: number) => {
                        expectToEqual(badgeCmp.identifiers, expectedEditors[i].identifiers);
                    });
                });
            });

            describe('... if `selectedEditionComplex` is not given, and `viewContext` is not preface or rowtables', () => {
                beforeEach(() => {
                    mockViewContextSignal.set(expectedDefaultViewContext);
                    editionStateService.updateSelectedEditionComplex(null);
                    editionStateService.updateSelectedEditionSeries(null);
                    editionStateService.updateSelectedEditionSection(null);

                    fixture.detectChanges();
                });

                it('... should have state signals to hold the expected values', () => {
                    expectToEqual(component.viewContext(), expectedDefaultViewContext);
                    expectToBe(component.selectedEditionComplex(), null);
                    expectToBe(component.selectedEditionSeries(), null);
                    expectToBe(component.selectedEditionSection(), null);
                });

                it('... should have signal `jumbotronTitle` to hold the default title', () => {
                    expectToBe(component.jumbotronTitle(), expectedTitle);
                });

                describe('... should contain no view-specific-components', () => {
                    it.each([
                        { desc: '`div.awg-edition-preface`', selector: 'div.awg-edition-preface' },
                        { desc: '`div.awg-edition-rowtables`', selector: 'div.awg-edition-rowtables' },
                        { desc: '`div.awg-edition-complex`', selector: 'div.awg-edition-complex' },
                    ])('... should contain no $desc in `div.awg-edition-view`', ({ selector }) => {
                        getAndExpectDebugElementByCss(getEditionViewDes()[0], selector, 0, 0);
                    });
                });

                it('... should have one `div.awg-edition-series` in `div.awg-edition-view`', () => {
                    getSeriesDes();
                });

                it('... should have a BreadcrumbComponent (stubbed) and a JumbotronComponent (stubbed) in `div.awg-edition-series`', () => {
                    const seriesDes = getSeriesDes();

                    getAndExpectDebugElementByDirective(seriesDes[0], EditionBreadcrumbStubComponent, 1, 1);
                    getAndExpectDebugElementByDirective(seriesDes[0], EditionJumbotronStubComponent, 1, 1);
                });

                it('... should pass down `breadcrumbItems` to BreadcrumbComponent (stubbed)', () => {
                    const breadcrumbDes = getAndExpectDebugElementByDirective(
                        getSeriesDes()[0],
                        EditionBreadcrumbStubComponent,
                        1,
                        1
                    );
                    const breadcrumbCmp = breadcrumbDes[0].injector.get(
                        EditionBreadcrumbStubComponent
                    ) as EditionBreadcrumbStubComponent;

                    expectToEqual(breadcrumbCmp.items(), component.breadcrumbItems());
                });

                it('... should pass down `editionViewId` and `editionViewTitle` to JumbotronComponent (stubbed)', () => {
                    const jumbotronDes = getAndExpectDebugElementByDirective(
                        getSeriesDes()[0],
                        EditionJumbotronStubComponent,
                        1,
                        1
                    );
                    const jumbotronCmp = jumbotronDes[0].injector.get(
                        EditionJumbotronStubComponent
                    ) as EditionJumbotronStubComponent;

                    expectToBe(jumbotronCmp.jumbotronId, expectedId);
                    expectToBe(jumbotronCmp.jumbotronTitle, expectedTitle);
                });

                describe('... if `viewContext` is intro', () => {
                    beforeEach(() => {
                        mockViewContextSignal.set(expectedIntroViewContext);

                        fixture.detectChanges();
                    });

                    it('... should have signal `viewContext` to hold true for intro view', () => {
                        expectToEqual(component.viewContext(), expectedIntroViewContext);
                    });

                    it('... should have signal `jumbotronTitle` to hold the intro title', () => {
                        expectToBe(component.jumbotronTitle(), EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full);
                    });

                    it('... should pass down correct title to JumbotronComponent (stubbed)', () => {
                        const jumbotronDes = getAndExpectDebugElementByDirective(
                            getSeriesDes()[0],
                            EditionJumbotronStubComponent,
                            1,
                            1
                        );
                        const jumbotronCmp = jumbotronDes[0].injector.get(
                            EditionJumbotronStubComponent
                        ) as EditionJumbotronStubComponent;

                        expectToBe(jumbotronCmp.jumbotronId, expectedId);
                        expectToBe(jumbotronCmp.jumbotronTitle, EDITION_ROUTE_CONSTANTS.EDITION_INTRO.full);
                    });
                });
            });
        });
    });
});
