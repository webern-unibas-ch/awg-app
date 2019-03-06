/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { HomeViewComponent } from './home-view.component';

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes, routerLinks;

    let mockCoreService: Partial<CoreService>;
    let mockRouter;

    let expectedMetaData: Meta;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = { getMetaData: () => expectedMetaData };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [HomeViewComponent, RouterLinkStubDirective],
            providers: [{ provide: CoreService, useValue: mockCoreService }, { provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedMetaData = new Meta();
        expectedMetaData.edition = { editors: 'Test Editor 1', lastModified: '9. Oktober 2018' };

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
        spyOn(component, 'routeToSidenav').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);

        // changing the stub service has no effect on the injected service
        const changedMetaData = new Meta();
        changedMetaData.edition = { editors: 'Test Editor 2', lastModified: '10. Oktober 2018' };
        mockCoreService.getMetaData = () => changedMetaData;

        expect(coreService.getMetaData()).toBe(expectedMetaData);
    });

    describe('BEFORE initial data binding', () => {
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

        it('should not have metadata', () => {
            expect(component.metaData).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain three `div.para` & one `div.declamation` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.para', 3, 3);
                getAndExpectDebugElementByCss(compDe, 'div.declamation', 1, 1);
            });

            it('... should not render `editors` and `lastmodified` yet', () => {
                const editorsDes = getAndExpectDebugElementByCss(compDe, '.editors', 1, 1);
                const editorsEl = editorsDes[0].nativeElement;

                const versionDes = getAndExpectDebugElementByCss(compDe, '.version', 1, 1);
                const versionEl = versionDes[0].nativeElement;

                expect(editorsEl).toBeDefined();
                expect(editorsEl.innerHTML).toBe('', 'should be empty string');

                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toBe('', 'be contain empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.metaData = mockCoreService.getMetaData();

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
                expect(component.metaData).toBeDefined();
                expect(component.metaData).toBe(expectedMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should render `editors` and `lastmodified` in declamation', () => {
                const editorsDes = getAndExpectDebugElementByCss(compDe, '.editors', 1, 1);
                const editorsEl = editorsDes[0].nativeElement;

                const versionDes = getAndExpectDebugElementByCss(compDe, '.version', 1, 1);
                const versionEl = versionDes[0].nativeElement;

                expect(editorsEl).toBeDefined();
                expect(editorsEl.innerHTML).toContain(
                    expectedMetaData.edition.editors,
                    `should contain ${expectedMetaData.edition.editors}`
                );

                expect(versionEl).toBeDefined();
                expect(versionEl.textContent).toContain(
                    expectedMetaData.edition.lastModified,
                    `should contain ${expectedMetaData.edition.lastModified}`
                );
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
                expect(routerLinks[0].linkParams).toBe('/structure');
            });

            it('... can click `structure` link in template', () => {
                const structureLinkDe = linkDes[0]; // contact link DebugElement
                const structureLink = routerLinks[0]; // contact link directive

                expect(structureLink.navigatedTo).toBeNull('should not have navigated yet');

                structureLinkDe.triggerEventHandler('click', null);

                fixture.detectChanges();

                expect(structureLink.navigatedTo).toBe('/structure');
            });
        });
    });
});
