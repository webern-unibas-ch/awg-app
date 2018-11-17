/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FooterComponent } from './footer.component';
import { Logo, Logos, Meta } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

// mock components
@Component({ selector: 'awg-footer-text', template: '' })
class FooterTextStubComponent {
    @Input()
    metaData: Meta;
}

@Component({ selector: 'awg-footer-logo', template: '' })
class FooterLogoStubComponent {
    @Input()
    logo: Logo;
}

describe('FooterComponent (DONE)', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockCoreService: Partial<CoreService>;

    let expectedMetaData: Meta;
    let expectedLogos: Logos;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaData: () => expectedMetaData,
            getLogos: () => expectedLogos
        };

        TestBed.configureTestingModule({
            declarations: [FooterComponent, FooterLogoStubComponent, FooterTextStubComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test logos
        expectedLogos = {
            unibas: {
                id: 'unibaslogo',
                src: 'assets/img/logos/uni.svg',
                alt: 'Logo Uni Basel',
                href: 'http://www.unibas.ch'
            },
            snf: { id: 'snflogo', src: 'assets/img/logos/snf.jpg', alt: 'Logo SNF', href: 'http://www.snf.ch' }
        };
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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);

        // changing the stub service has no effect on the injected service
        const changedMetaData = new Meta();
        changedMetaData.page = {
            yearStart: 2015,
            yearRecent: 2017,
            version: '1.0.0',
            versionReleaseDate: '8. November 2016'
        };
        mockCoreService.getMetaData = () => changedMetaData;

        expect(coreService.getMetaData()).toBe(expectedMetaData);
    });

    describe('BEFORE initial data binding', () => {
        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });
        });

        it('should not have metaData', () => {
            expect(component.metaData).toBeUndefined('should be undefined');
        });

        it('should not have logos', () => {
            expect(component.logos).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 1 footer text component (stubbed)', () => {
                const footerTextDes = fixture.debugElement.queryAll(By.directive(FooterTextStubComponent));
                expect(footerTextDes).toBeTruthy();
                expect(footerTextDes.length).toBe(1, 'should have 1 text component');
            });

            it('... should contain 2 footer logo components (stubbed)', () => {
                const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                expect(footerLogoDes).toBeTruthy();
                expect(footerLogoDes.length).toBe(2, 'should have 2 footer logos');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the input values supplied by the parent component
            expectedMetaData = new Meta();
            expectedMetaData.page = {
                yearStart: 2015,
                yearRecent: 2017,
                version: '1.0.0',
                versionReleaseDate: '8. November 2016'
            };

            // simulate the parent setting the input properties
            component.metaData = expectedMetaData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return metadata', () => {
                expect(component.metaData).toBeDefined();
                expect(component.metaData).toBe(expectedMetaData);
            });

            it('should return logos', () => {
                expect(component.logos).toBeDefined();
                expect(component.logos).toBe(expectedLogos);
            });
        });

        describe('VIEW', () => {
            it('should pass down metaData to footer text component', () => {
                const footerTextDe = fixture.debugElement.query(By.directive(FooterTextStubComponent));
                const footerTextCmp = footerTextDe.injector.get(FooterTextStubComponent) as FooterTextStubComponent;

                expect(footerTextCmp.metaData.page).toBeTruthy();
                expect(footerTextCmp.metaData.page).toEqual(expectedMetaData.page, 'should have page metaData');
            });

            it('should pass down logos to footer logo components', () => {
                const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                const footerLogoCmps = [];
                footerLogoDes.forEach(de => {
                    footerLogoCmps.push(de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent);
                });

                expect(footerLogoCmps[0].logo).toBeTruthy();
                expect(footerLogoCmps[0].logo).toEqual(expectedLogos.unibas, 'should have unibas logo');

                expect(footerLogoCmps[1].logo).toBeTruthy();
                expect(footerLogoCmps[1].logo).toEqual(expectedLogos.snf, 'should have snf logo');
            });
        });
    });
});
