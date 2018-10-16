/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { HomeViewComponent } from './home-view.component';
import { MetaService } from '@awg-core/services';
import { Meta } from '@awg-core/core-models';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HomeViewComponent (DONE)', () => {
    let component: HomeViewComponent;
    let fixture: ComponentFixture<HomeViewComponent>;
    let mockMetaService: Partial<MetaService>;
    let mockRouter;
    let linkDes;
    let routerLinks;
    let expectedMetaData: Meta;

    beforeEach(async(() => {
        // stub service for test purposes
        mockMetaService = { getMetaData: () => expectedMetaData };

        // router spy object
        mockRouter = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            declarations: [HomeViewComponent, RouterLinkStubDirective],
            providers: [{ provide: MetaService, useValue: mockMetaService }, { provide: Router, useValue: mockRouter }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HomeViewComponent);
        component = fixture.componentInstance;

        // test data
        expectedMetaData = {
            page: { yearStart: null, yearRecent: null, version: '', versionReleaseDate: '' },
            edition: { editors: 'Test Editor 1', lastModified: '9. Oktober 2018' },
            structure: { author: '', lastModified: '' }
        };

        // spies on component functions
        spyOn(component, 'provideMetaData');
        spyOn(component, 'routeToSidenav');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected metaService should not be the same', () => {
        const metaService = TestBed.get(MetaService);
        expect(mockMetaService === metaService).toBe(false);

        // changing the stub service has no effect on the injected service
        const changedMetaData = {
            page: { yearStart: null, yearRecent: null, version: '', versionReleaseDate: '' },
            edition: { editors: 'Test Editor 2', lastModified: '10. Oktober 2018' },
            structure: { author: '', lastModified: '' }
        };
        mockMetaService.getMetaData = () => changedMetaData;
        expect(metaService.getMetaData()).toBe(expectedMetaData);
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
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.metaData = mockMetaService.getMetaData();

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#routeToSideNav', () => {
            it('... should have been called', () => {
                expect(component.routeToSidenav).toHaveBeenCalled();
            });

            it('... should tell ROUTER to navigate to editionInfo outlet', () => {
                const outlet = { outlets: { side: 'editionInfo' } };
                mockRouter.navigate(outlet);

                fixture.detectChanges();

                // expecting to navigate to editionInfo outlet
                expect(mockRouter.navigate).toHaveBeenCalledWith(outlet);
            });
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.metaData).toBe(expectedMetaData);
            });
        });

        describe('VIEW', () => {
            let homeDe: DebugElement;
            let homeEl;

            beforeEach(() => {
                homeDe = fixture.debugElement;
                homeEl = homeDe.nativeElement;
            });

            it('... should have 3 `div.para` & 1 `div.declamation`', () => {
                const paraEl = homeEl.querySelectorAll('div.para');
                const declamationEl = homeEl.querySelectorAll('div.declamation');

                expect(paraEl.length).toBe(3, 'should have 3 `div.para`');
                expect(declamationEl.length).toBe(1, 'should have 1 `div.declamation`');
            });

            it('... should show `editors` and `lastmodified` in declamation', () => {
                const editorsDe = homeDe.query(By.css('.editors'));
                const editorsEl = editorsDe.nativeElement;

                const versionDe = homeDe.query(By.css('.version'));
                const versionEl = versionDe.nativeElement;

                expect(editorsEl.innerHTML).toContain(expectedMetaData.edition.editors);
                expect(versionEl.textContent).toContain(expectedMetaData.edition.lastModified);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));

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
