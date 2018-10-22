/* tslint:disable:no-unused-variable */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { RouterLinkStubDirective, RouterOutletStubComponent } from 'testing/router-stubs';

import { AppComponent } from './app.component';

import { MetaService } from '@awg-core/services';
import { Meta } from '@awg-core/core-models';
import { By } from '@angular/platform-browser';

// mock components
@Component({ selector: 'awg-navbar', template: '' })
class NavbarStubComponent {}

@Component({ selector: 'awg-footer', template: '' })
class FooterStubComponent {
    @Input()
    metaData: Meta;
}

describe('AppComponent (DONE)', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockMetaService: Partial<MetaService>;

    let expectedMetaData: Meta;

    beforeEach(async(() => {
        // stub service for test purposes
        mockMetaService = { getMetaData: () => expectedMetaData };

        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                FooterStubComponent,
                NavbarStubComponent,
                RouterLinkStubDirective,
                RouterOutletStubComponent
            ],
            providers: [{ provide: MetaService, useValue: mockMetaService }]
        });
        TestBed.compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test meta data
        expectedMetaData = new Meta();
        expectedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2018,
            version: '0.2.0',
            versionReleaseDate: '18. Oktober 2018'
        };

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    it('should create the app', async(() => {
        expect(component).toBeTruthy();
    }));

    it('stub service and injected metaService should not be the same', () => {
        const metaService = TestBed.get(MetaService);
        expect(mockMetaService === metaService).toBe(false);

        // changing the stub service has no effect on the injected service
        const changedMetaData = new Meta();
        changedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2017,
            version: '1.0.0',
            versionReleaseDate: '8. November 2016'
        };
        mockMetaService.getMetaData = () => changedMetaData;

        expect(metaService.getMetaData()).toBe(expectedMetaData);
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        it('should not have metadata', () => {
            expect(component.metaData).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain one header component (stubbed)', () => {
                const navbarDes = compDe.queryAll(By.directive(NavbarStubComponent));

                expect(navbarDes).toBeDefined();
                expect(navbarDes.length).toBe(1, 'should have only one navbar');
            });

            it('... should contain two router outlets (stubbed), one ot those named', () => {
                const routletDe = compDe.queryAll(By.directive(RouterOutletStubComponent));

                expect(routletDe).toBeDefined();
                expect(routletDe.length).toBe(2, 'should have 2 router outlets');

                // first outlet shoud be named 'side'
                expect(routletDe[0].attributes).toBeDefined();
                expect(routletDe[0].attributes.name).toBeDefined();
                expect(routletDe[0].attributes.name).toBe('side');
            });

            it('... should contain one footer component (stubbed)', () => {
                const footerDes = compDe.queryAll(By.directive(FooterStubComponent));

                expect(footerDes).toBeDefined();
                expect(footerDes.length).toBe(1, 'should have only one footer');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
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
            it('should pass down metaData to footer component', () => {
                const footerDe = fixture.debugElement.query(By.directive(FooterStubComponent));
                const footerCmp = footerDe.injector.get(FooterStubComponent) as FooterStubComponent;

                expect(footerCmp.metaData).toBeTruthy();
                expect(footerCmp.metaData).toBe(expectedMetaData, 'should have metadata');
            });
        });
    });
});
