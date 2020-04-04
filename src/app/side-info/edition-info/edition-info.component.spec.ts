/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from 'testing/router-stubs';
import { Meta, MetaContact, MetaEdition, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';
import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { EditionInfoComponent } from './edition-info.component';

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    let mockCoreService: Partial<CoreService>;

    const expectedTitle = 'Beispieleditionen ausgewählter Skizzen';
    let expectedEditionWorkOp12: EditionWork;
    let expectedEditionWorkOp25: EditionWork;
    let expectedEditionMetaData: MetaEdition;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaDataSection: sectionType => METADATA[sectionType]
        };

        TestBed.configureTestingModule({
            declarations: [EditionInfoComponent, RouterLinkStubDirective],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedEditionWorkOp12 = EditionWorks.op12;
        expectedEditionWorkOp25 = EditionWorks.op25;
        expectedEditionMetaData = METADATA[MetaSectionTypes.edition];

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const coreService = TestBed.get(CoreService);
        const CHANGEDMETA: Meta = {
            page: new MetaPage(),
            edition: new MetaEdition(),
            structure: new MetaStructure(),
            contact: new MetaContact()
        };
        mockCoreService = { getMetaDataSection: sectionType => CHANGEDMETA[sectionType] };

        expect(coreService.getMetaDataSection(MetaSectionTypes.edition)).toBe(expectedEditionMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('should have info view title', () => {
            expect(component.editionInfoViewTitle).toBeDefined();
            expect(component.editionInfoViewTitle).toBe(expectedTitle);
        });

        it('should have editionWorks', () => {
            expect(component.editionWorkOp12).toBeDefined('should be defined');
            expect(component.editionWorkOp25).toBeDefined('should be defined');

            expect(component.editionWorkOp12).toEqual(expectedEditionWorkOp12, `should be ${expectedEditionWorkOp12}`);
            expect(component.editionWorkOp25).toEqual(expectedEditionWorkOp25, `should be ${expectedEditionWorkOp25}`);
        });

        it('... should not have editionMetaData', () => {
            expect(component.editionMetaData).toBeUndefined('should be undefined');
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain two `h6` header and 5 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h6.awg-edition-info-header', 2, 2);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 5, 5);
            });

            it('... should not render series of edition info headers yet', () => {
                const seriesDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-breadcrumb',
                    2,
                    2
                );

                const series1El = seriesDes[0].nativeElement;
                const series2El = seriesDes[1].nativeElement;

                expect(series1El).toBeDefined();
                expect(series2El).toBeDefined();

                expect(series1El.textContent).not.toBeTruthy(`should be empty string`);
                expect(series2El.textContent).not.toBeTruthy(`should be empty string`);
            });

            it('... should not render title of edition info headers yet', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header i.awg-edition-info-header-title',
                    2,
                    2
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();

                expect(title1El.textContent).not.toBeTruthy(`should be empty string`);
                expect(title2El.textContent).not.toBeTruthy(`should be empty string`);
            });

            it('... should not render catalogue of edition info headers yet', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();

                expect(catalogue1El.innerHTML).not.toBeTruthy(`should be empty string`);
                expect(catalogue2El.innerHTML).not.toBeTruthy(`should be empty string`);
            });

            it('... should not render links in edition info headers yet', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, '.awg-edition-info-header a', 3, 3);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();

                expect(a1El.textContent).not.toBeTruthy(`should be empty string`);
                expect(a2El.textContent).not.toBeTruthy(`should be empty string`);
                expect(a3El.textContent).not.toBeTruthy(`should be empty string`);
            });

            it('... should not render editor information yet', () => {
                const editorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-edition-info-editors a', 1, 1);
                const editorEl = editorDes[0].nativeElement;

                expect(editorEl).toBeDefined();
                expect(editorEl.href).toBe('', 'should be empty string');
                expect(editorEl.innerHTML).toBe('', 'should be empty string');
            });

            it('... should not render last modification date yet', () => {
                const dateDes = getAndExpectDebugElementByCss(compDe, 'span#awg-edition-info-lastmodified', 1, 1);
                const dateEl = dateDes[0].nativeElement;

                expect(dateEl.textContent).toBeDefined();
                expect(dateEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.editionMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.edition);

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return editionMetaData', () => {
                expect(component.editionMetaData).toBeDefined();
                expect(component.editionMetaData).toBe(expectedEditionMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should render series of edition info headers', () => {
                const seriesDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-breadcrumb',
                    2,
                    2
                );

                const series1El = seriesDes[0].nativeElement;
                const series2El = seriesDes[1].nativeElement;

                const expectedBreadCrumb1 = `${expectedEditionWorkOp12.edition.short} ${expectedEditionWorkOp12.series.short}/${expectedEditionWorkOp12.section.short}`;
                const expectedBreadCrumb2 = `${expectedEditionWorkOp25.edition.short} ${expectedEditionWorkOp25.series.short}/${expectedEditionWorkOp25.section.short}`;

                expect(series1El).toBeDefined();
                expect(series2El).toBeDefined();

                expect(series1El.textContent).toBe(expectedBreadCrumb1, `should be ${expectedBreadCrumb1}`);
                expect(series2El.textContent).toBe(expectedBreadCrumb2, `should be ${expectedBreadCrumb2}`);
            });

            it('... should render title of edition info headers', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header i.awg-edition-info-header-title',
                    2,
                    2
                );

                const title1El = titleDes[0].nativeElement;
                const title2El = titleDes[1].nativeElement;

                expect(title1El).toBeDefined();
                expect(title2El).toBeDefined();

                expect(title1El.textContent).toBe(
                    expectedEditionWorkOp12.titleStatement.title,
                    `should be ${expectedEditionWorkOp12.titleStatement.title}`
                );
                expect(title2El.textContent).toBe(
                    expectedEditionWorkOp25.titleStatement.title,
                    `should be ${expectedEditionWorkOp25.titleStatement.title}`
                );
            });

            it('... should render catalogue of edition info headers', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h6.awg-edition-info-header .awg-edition-info-header-catalogue',
                    2,
                    2
                );

                const catalogue1El = catalogueDes[0].nativeElement;
                const catalogue2El = catalogueDes[1].nativeElement;

                expect(catalogue1El).toBeDefined();
                expect(catalogue2El).toBeDefined();

                expect(catalogue1El.innerHTML).toBe(
                    expectedEditionWorkOp12.work.short,
                    `should be ${expectedEditionWorkOp12.work.short}`
                );
                expect(catalogue2El.innerHTML).toBe(
                    expectedEditionWorkOp25.work.short,
                    `should be ${expectedEditionWorkOp25.work.short}`
                );
            });

            it('... should render links in edition info headers', () => {
                const aDes = getAndExpectDebugElementByCss(compDe, '.awg-edition-info-header a', 3, 3);

                const a1El = aDes[0].nativeElement;
                const a2El = aDes[1].nativeElement;
                const a3El = aDes[2].nativeElement;

                expect(a1El).toBeDefined();
                expect(a2El).toBeDefined();
                expect(a3El).toBeDefined();

                expect(a1El.textContent).toBe(
                    expectedEditionWorkOp12.type.full,
                    `should be ${expectedEditionWorkOp12.type.full}`
                );
                expect(a2El.textContent).toBe(
                    expectedEditionWorkOp25.type.full,
                    `should be ${expectedEditionWorkOp25.type.full}`
                );
                expect(a3El.textContent).toBe(
                    expectedEditionWorkOp25.graphRoute.short,
                    `should be ${expectedEditionWorkOp25.graphRoute.short}`
                );
            });

            it('... should render editor information', () => {
                const expectedEditor = expectedEditionMetaData.editors[0];

                const editorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-edition-info-editors a', 1, 1);
                const editorEl = editorDes[0].nativeElement;

                expect(editorEl).toBeDefined();
                expect(editorEl.href).toBe(expectedEditor.contactUrl, `should be ${expectedEditor.contactUrl}`);
                expect(editorEl.innerHTML).toBe(expectedEditor.name, `should be ${expectedEditor.name}`);
            });

            it('... should render last modification date', () => {
                const expectedLastModified = expectedEditionMetaData.lastModified;

                const lastmodDes = getAndExpectDebugElementByCss(compDe, 'span#awg-edition-info-lastmodified', 1, 1);
                const lastmodEl = lastmodDes[0].nativeElement;

                expect(lastmodEl.textContent).toBeDefined();
                expect(lastmodEl.textContent).toContain(expectedLastModified, `should contain ${expectedLastModified}`);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 3, 3);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(3, 'should have 3 routerLinks');
                expect(routerLinks[0].linkParams).toEqual([
                    expectedEditionWorkOp12.baseRoute,
                    expectedEditionWorkOp12.introRoute.route
                ]);
                expect(routerLinks[1].linkParams).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.detailRoute.route
                ]);
                expect(routerLinks[2].linkParams).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.graphRoute.route
                ]);
            });

            it('... can click `intro` link in template', () => {
                const introLinkDe = linkDes[0]; // contact link DebugElement
                const introLink = routerLinks[0]; // contact link directive

                expect(introLink.navigatedTo).toBeNull('should not have navigated yet');

                introLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(introLink.navigatedTo).toEqual([
                    expectedEditionWorkOp12.baseRoute,
                    expectedEditionWorkOp12.introRoute.route
                ]);
            });

            it('... can click `detail` link in template', () => {
                const detailLinkDe = linkDes[1]; // contact link DebugElement
                const detailLink = routerLinks[1]; // contact link directive

                expect(detailLink.navigatedTo).toBeNull('should not have navigated yet');

                detailLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(detailLink.navigatedTo).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.detailRoute.route
                ]);
            });

            it('... can click `graph` link in template', () => {
                const graphLinkDe = linkDes[2]; // contact link DebugElement
                const graphLink = routerLinks[2]; // contact link directive

                expect(graphLink.navigatedTo).toBeNull('should not have navigated yet');

                graphLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(graphLink.navigatedTo).toEqual([
                    expectedEditionWorkOp25.baseRoute,
                    expectedEditionWorkOp25.graphRoute.route
                ]);
            });
        });
    });
});
