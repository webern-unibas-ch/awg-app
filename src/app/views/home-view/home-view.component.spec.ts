/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { Router } from '@angular/router';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { Meta, MetaContact, MetaEdition, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';
import { EditionWork, EditionWorks } from '@awg-views/edition-view/models';

import { HomeViewComponent } from './home-view.component';

// mock heading component
@Component({ selector: 'awg-heading', template: '' })
class HeadingStubComponent {
    @Input()
    title: string;
    @Input()
    id: string;
}

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    let mockCoreService: Partial<CoreService>;
    let mockRouter;

    const expectedTitle = 'Beispieleditionen ausgewählter Skizzen';
    const expectedId = 'awg-home-view';

    let expectedEditionWorkOp12: EditionWork;
    let expectedEditionWorkOp25: EditionWork;
    let expectedEditionMetaData: MetaEdition;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [HomeViewComponent, HeadingStubComponent, RouterLinkStubDirective],
            providers: [
                { provide: CoreService, useValue: mockCoreService },
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeViewComponent);
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
        spyOn(component, 'routeToSidenav').and.callThrough();
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
        it('should have title and id', () => {
            expect(component.homeViewTitle).toBeDefined();
            expect(component.homeViewTitle).toBe(expectedTitle);

            expect(component.homeViewId).toBeDefined();
            expect(component.homeViewId).toBe(expectedId);
        });

        it('should have editionWorks', () => {
            expect(component.editionWorkOp12).toBeDefined('should be defined');
            expect(component.editionWorkOp25).toBeDefined('should be defined');

            expect(component.editionWorkOp12).toEqual(expectedEditionWorkOp12, `should be ${expectedEditionWorkOp12}`);
            expect(component.editionWorkOp25).toEqual(expectedEditionWorkOp25, `should be ${expectedEditionWorkOp25}`);
        });

        it('should not have metadata', () => {
            expect(component.editionMetaData).toBeUndefined('should be undefined');
        });

        describe('#routeToSidenav', () => {
            it('... should not have been called', () => {
                expect(component.routeToSidenav).not.toHaveBeenCalled();
            });
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain two `div.para` & one `div.declamation` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                getAndExpectDebugElementByCss(compDe, 'div.declamation', 1, 1);
            });

            it('... should have one h6 and two h3 in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'h3.awg-edition-info-header', 2, 2);
            });

            it('... should not render bread crumb header in first div.para yet', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBe(' ', `should be empty string`);
            });

            it('... should not render title of edition info headers in first div.para yet', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h3.awg-edition-info-header i.awg-edition-info-header-title',
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

            it('... should not render catalogue of edition info headers in first div.para yet', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
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

            it('... should not render links of edition info headers in first div.para yet', () => {
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

            it('... should not render `editors` yet', () => {
                const editorsDes = getAndExpectDebugElementByCss(compDe, '.editors a', 1, 1);
                const editorsEl = editorsDes[0].nativeElement;

                expect(editorsEl).toBeDefined();
                expect(editorsEl.href).not.toBeTruthy(`should be empty string`);
                expect(editorsEl.textContent).not.toBeTruthy(`should be empty string`);
            });

            it('... should not render `lastmodified` yet', () => {
                const versionDes = getAndExpectDebugElementByCss(compDe, '.version', 1, 1);
                const versionEl = versionDes[0].nativeElement;

                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).not.toBeTruthy(`should be empty string`);
            });

            it('... should not pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeUndefined();
                expect(headingCmp.id).toBeUndefined();
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

        describe('#routeToSideNav', () => {
            let navigationSpy;

            beforeEach(() => {
                // create spy of mockrouter SpyObj
                navigationSpy = mockRouter.navigate as jasmine.Spy;
            });

            it('... should have been called', () => {
                // router navigation triggerd by onInit
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should have triggered `router.navigate`', () => {
                expectSpyCall(navigationSpy, 1);
            });

            it('... should tell ROUTER to navigate to `editionInfo` outlet', () => {
                const expectedRoute = 'editionInfo';

                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const outletRoute = navArgs[0][0].outlets.side;

                expect(navArgs).toBeDefined('should have navArgs');
                expect(navArgs[0]).toBeDefined('should have navCommand');
                expect(outletRoute).toBeDefined('should have outletRoute');
                expect(outletRoute).toBe(expectedRoute, 'should be `editionInfo`');

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });

            it('... should tell ROUTER to navigate with `preserveFragment:true`', () => {
                // catch args passed to navigation spy
                const navArgs = navigationSpy.calls.first().args;
                const navExtras = navArgs[1];

                expect(navExtras).toBeDefined('should have navExtras');
                expect(navExtras.preserveFragment).toBeDefined('should have preserveFragment extra');
                expect(navExtras.preserveFragment).toBe(true, 'should be `preserveFragment:true`');

                expect(navigationSpy).toHaveBeenCalledWith(navArgs[0], navArgs[1]);
            });
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.editionMetaData).toBeDefined();
                expect(component.editionMetaData).toBe(expectedEditionMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should pass down `title` and `id` to heading component', () => {
                const headingDes = getAndExpectDebugElementByDirective(compDe, HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expect(headingCmp.title).toBeTruthy();
                expect(headingCmp.title).toBe(expectedTitle, `should have title: ${expectedTitle}`);

                expect(headingCmp.id).toBeTruthy();
                expect(headingCmp.id).toBe(expectedId, `should have id: ${expectedId}`);
            });

            it('... should render bread crumb header in first div.para', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.para', 2, 2);
                const headerDes = getAndExpectDebugElementByCss(divDes[0], 'h6.awg-breadcrumb', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                const expectedBreadCrumb = ` ${expectedEditionWorkOp12.edition.short} / ${expectedEditionWorkOp12.series.full} / ${expectedEditionWorkOp12.section.full} `;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBe(expectedBreadCrumb, `should be ${expectedBreadCrumb}`);
            });

            it('... should render title of edition info headers in first div.para', () => {
                const titleDes = getAndExpectDebugElementByCss(
                    compDe,
                    'h3.awg-edition-info-header i.awg-edition-info-header-title',
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

            it('... should render catalogue of edition info headers in first div.para', () => {
                const catalogueDes = getAndExpectDebugElementByCss(
                    compDe,
                    '.awg-edition-info-header .awg-edition-info-header-catalogue',
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

            it('... should render part links in first div.para', () => {
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

            it('... should render `editors` in div.declamation', () => {
                const editorsDes = getAndExpectDebugElementByCss(compDe, 'div.declamation .editors a', 1, 1);
                const editorsEl = editorsDes[0].nativeElement;

                expect(editorsEl).toBeDefined();
                expect(editorsEl.href).toBe(
                    expectedEditionMetaData.editors[0].contactUrl,
                    `should be ${expectedEditionMetaData.editors[0].contactUrl}`
                );
                expect(editorsEl.innerHTML).toBe(
                    expectedEditionMetaData.editors[0].name,
                    `should be ${expectedEditionMetaData.editors[0].name}`
                );
            });

            it('... should render `lastmodified` in div.declamation', () => {
                const versionDes = getAndExpectDebugElementByCss(compDe, 'div.declamation .version', 1, 1);
                const versionEl = versionDes[0].nativeElement;

                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toBe(
                    expectedEditionMetaData.lastModified,
                    `should be ${expectedEditionMetaData.lastModified}`
                );
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 4, 4);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(4, 'should have 4 routerLinks');
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
                expect(routerLinks[3].linkParams).toBe('/structure');
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

            it('... can click `structure` link in template', () => {
                const structureLinkDe = linkDes[3]; // contact link DebugElement
                const structureLink = routerLinks[3]; // contact link directive

                expect(structureLink.navigatedTo).toBeNull('should not have navigated yet');

                structureLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(structureLink.navigatedTo).toBe('/structure');
            });
        });
    });
});
