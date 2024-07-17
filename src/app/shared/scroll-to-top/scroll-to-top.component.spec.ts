import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import Spy = jasmine.Spy;

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faArrowUp, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { clickAndAwaitChanges } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { expectSpyCall, expectToBe, expectToEqual, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { ScrollToTopComponent } from './scroll-to-top.component';

describe('ScrollToTopComponent (DONE)', () => {
    let component: ScrollToTopComponent;
    let fixture: ComponentFixture<ScrollToTopComponent>;
    let compDe: DebugElement;

    let scrollToTopSpy: Spy;

    let expectedScrollThreshold: number;
    let expectedArrowIcon: IconDefinition;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [ScrollToTopComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ScrollToTopComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Trigger initial data binding
        fixture.detectChanges();

        // Test data
        expectedScrollThreshold = 300;
        expectedArrowIcon = faArrowUp;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        scrollToTopSpy = spyOn(component, 'scrollToTop').and.callThrough();
    }));

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('... should have `faArrowUp`', () => {
        expectToEqual(component.faArrowUp, faArrowUp);
    });

    it('... should not have `isScrolled`', () => {
        expect(component.isScrolled).toBeUndefined();
    });

    describe('#VIEW', () => {
        describe('... should contain no button.awg-scroll-to-top if', () => {
            it('... isScrolled is undefined', () => {
                component.isScrolled = undefined;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top', 0, 0);
            });

            it('... isScrolled is false', () => {
                component.isScrolled = false;
                detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top', 0, 0);
            });
        });

        describe('... with isScrolled set to true', () => {
            beforeEach(() => {
                component.isScrolled = true;
                detectChangesOnPush(fixture);
            });

            it('... should contain one button.awg-scroll-to-top if isScrolled is true', () => {
                getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top', 1, 1);
            });

            it('... should display arrow icon in scroll button ', () => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top', 1, 1);
                const faIconDes = getAndExpectDebugElementByCss(btnDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns, expectedArrowIcon);
            });

            it('... should trigger `scrollToTop` method on button click', fakeAsync(() => {
                const btnDes = getAndExpectDebugElementByCss(compDe, 'button.awg-scroll-to-top', 1, 1);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(btnDes[0], fixture);

                expectSpyCall(scrollToTopSpy, 1);
            }));
        });
    });

    describe('#Hostlistener checkScroll()', () => {
        it('... should have a hostlistener `checkScroll`', () => {
            expect(component.checkScroll).toBeDefined();
        });

        it('... should default to 0 if window.scrollY is undefined', () => {
            const scrollEventBelowThreshold = new Event('scroll') as any;
            Object.defineProperty(scrollEventBelowThreshold, 'currentTarget', {
                value: { scrollY: undefined },
                writable: true,
            });
            component.checkScroll(scrollEventBelowThreshold);

            expectToBe(component.isScrolled, false);
        });

        it('... should set `isScrolled` to true if scrollY is above threshold', () => {
            const scrollEventAboveThreshold = new Event('scroll') as any;
            Object.defineProperty(scrollEventAboveThreshold, 'currentTarget', {
                value: { scrollY: expectedScrollThreshold + 1 },
                writable: true,
            });
            component.checkScroll(scrollEventAboveThreshold);

            expectToBe(component.isScrolled, true);
        });

        it('... should set `isScrolled` to false if scrollY is below threshold', () => {
            const scrollEventBelowThreshold = new Event('scroll') as any;
            Object.defineProperty(scrollEventBelowThreshold, 'currentTarget', {
                value: { scrollY: expectedScrollThreshold - 1 },
                writable: true,
            });
            component.checkScroll(scrollEventBelowThreshold);

            expectToBe(component.isScrolled, false);
        });

        it('... should toggle `isScrolled` based on scrollY position of scroll event', () => {
            const scrollEventBelowThreshold = new Event('scroll') as any;
            Object.defineProperty(scrollEventBelowThreshold, 'currentTarget', {
                value: { scrollY: expectedScrollThreshold - 1 },
                writable: true,
            });
            component.checkScroll(scrollEventBelowThreshold);

            expectToBe(component.isScrolled, false);

            const scrollEventAboveThreshold = new Event('scroll');
            Object.defineProperty(scrollEventAboveThreshold, 'currentTarget', {
                value: { scrollY: expectedScrollThreshold + 1 },
                writable: true,
            });
            component.checkScroll(scrollEventAboveThreshold);

            expectToBe(component.isScrolled, true);
        });
    });

    describe('#scrollToTop()', () => {
        it('... should have a method `scrollToTop`', () => {
            expect(component.scrollToTop).toBeDefined();
        });

        it('... should trigger window:scrollTo with correct parameters', () => {
            const scrollToSpy = spyOn(window, 'scrollTo');

            component.scrollToTop();

            expectSpyCall(scrollToSpy, 1, { top: 0, behavior: 'smooth' });
        });

        it('... should scroll to top of page', () => {
            const scrollEventBelowThreshold = new Event('scroll') as any;
            Object.defineProperty(scrollEventBelowThreshold, 'currentTarget', {
                value: { scrollY: expectedScrollThreshold + 1 },
                writable: true,
            });
            component.checkScroll(scrollEventBelowThreshold);

            expectToBe(component.isScrolled, true);

            component.scrollToTop();

            expectToBe(window.scrollY, 0);
        });
    });
});
