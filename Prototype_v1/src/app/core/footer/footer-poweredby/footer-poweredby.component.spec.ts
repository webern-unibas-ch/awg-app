import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { FooterPoweredbyComponent } from './footer-poweredby.component';
import { Logo, Logos } from '@awg-core/core-models';
import { By } from '@angular/platform-browser';

@Component({ selector: 'awg-footer-logo', template: '' })
class FooterLogoStubComponent {
    @Input()
    logo: Logo;
}

describe('FooterPoweredbyComponent (DONE)', () => {
    let component: FooterPoweredbyComponent;
    let fixture: ComponentFixture<FooterPoweredbyComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedLogos: Logos;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterPoweredbyComponent, FooterLogoStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterPoweredbyComponent);
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
            snf: {
                id: 'snflogo',
                src: 'assets/img/logos/snf.png',
                alt: 'Logo SNF',
                href: 'http://www.snf.ch'
            },
            angular: {
                id: 'angularlogo',
                src: 'assets/img/logos/angular.svg',
                alt: 'Logo Angular',
                href: 'https://angular.io'
            },
            bootstrap: {
                id: 'bootstraplogo',
                src: 'assets/img/logos/ng-bootstrap.svg',
                alt: 'Logo ng-Bootstrap',
                href: 'https://ng-bootstrap.github.io/'
            }
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have logos', () => {
            expect(component.logos).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should contain 1 div.awg-powered-by', () => {
                const footerPoweredbyDes = fixture.debugElement.queryAll(By.css('div.awg-powered-by'));

                expect(footerPoweredbyDes).toBeTruthy();
                expect(footerPoweredbyDes.length).toBe(1, 'should have 1 div.awg-powered-by');
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
            // simulate the parent setting the input properties
            component.logos = expectedLogos;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have logo', () => {
            expect(component.logos).toBeDefined();
            expect(component.logos).toBe(expectedLogos);
        });

        describe('VIEW', () => {
            it('... should pass down logos to footer logo components', () => {
                const footerLogoDes = fixture.debugElement.queryAll(By.directive(FooterLogoStubComponent));
                const footerLogoCmps = [];
                footerLogoDes.forEach(de => {
                    footerLogoCmps.push(de.injector.get(FooterLogoStubComponent) as FooterLogoStubComponent);
                });

                expect(footerLogoCmps.length).toBe(2, 'should have 2 logo components');

                expect(footerLogoCmps[0].logo).toBeTruthy();
                expect(footerLogoCmps[0].logo).toEqual(expectedLogos.angular, 'should have angular logo');

                expect(footerLogoCmps[1].logo).toBeTruthy();
                expect(footerLogoCmps[1].logo).toEqual(expectedLogos.bootstrap, 'should have bootstrap logo');
            });
        });
    });
});
