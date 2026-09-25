import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { expectSpyCall, expectToContain, expectToNotContain } from '@testing/expect-helper';

import { EditionIntroScrollDirective } from './edition-intro-scroll.directive';

// Mock component
@Component({
    standalone: true,
    imports: [EditionIntroScrollDirective],
    template: `
        <div awgEditionIntroScroll style="min-height: 2000px;">
            <div id="section1" class="awg-edition-intro-section" style="height: 100px;"></div>
            <div id="section2" class="awg-edition-intro-section" style="height: 100px;"></div>

            <a href="#section1" class="awg-edition-intro-nav-link">Link 1</a>
            <a href="#section2" class="awg-edition-intro-nav-link">Link 2</a>
        </div>
    `,
})
class TestHostComponent {}

describe('EditionIntroScrollDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let directiveDes: DebugElement[];
    let directiveInstance: EditionIntroScrollDirective;
    let section1: HTMLElement;
    let section2: HTMLElement;
    let navLink1: HTMLAnchorElement;
    let navLink2: HTMLAnchorElement;

    beforeEach(async () => {
        vi.useFakeTimers();

        await TestBed.configureTestingModule({
            imports: [TestHostComponent, EditionIntroScrollDirective],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();

        directiveDes = fixture.debugElement.queryAll(By.directive(EditionIntroScrollDirective));
        directiveInstance = directiveDes[0].injector.get(EditionIntroScrollDirective);
        const directiveEl = directiveDes[0].nativeElement as HTMLElement;

        section1 = directiveEl.querySelector('#section1') as HTMLElement;
        section2 = directiveEl.querySelector('#section2') as HTMLElement;

        const navLinks = directiveEl.querySelectorAll<HTMLAnchorElement>('a.awg-edition-intro-nav-link');
        navLink1 = navLinks[0];
        navLink2 = navLinks[1];

        Object.defineProperty(section1, 'offsetTop', { value: 100, configurable: true });
        Object.defineProperty(section1, 'offsetHeight', { value: 100, configurable: true });
        Object.defineProperty(section2, 'offsetTop', { value: 300, configurable: true });
        Object.defineProperty(section2, 'offsetHeight', { value: 100, configurable: true });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('... should create an instance', () => {
        expect(directiveDes[0]).toBeTruthy();
    });

    it('... should trigger `onWindowScroll` and update DOM when window is scrolled', () => {
        const onWindowScrollSpy = vi.spyOn(directiveInstance, 'onWindowScroll');
        vi.spyOn(globalThis, 'scrollY', 'get').mockReturnValue(150);

        window.dispatchEvent(new Event('scroll'));

        expectSpyCall(onWindowScrollSpy, 1);

        expectToContain(navLink1.classList, 'active');
        expectToNotContain(navLink2.classList, 'active');

        vi.advanceTimersByTime(200);
    });

    describe('METHODS', () => {
        describe('#onWindowScroll()', () => {
            it('... should have a method `onWindowScroll`', () => {
                expect(directiveInstance.onWindowScroll).toBeDefined();
            });

            it('... should trigger `_onIntroScroll` method when called', () => {
                const onIntroScrollSpy = vi.spyOn(directiveInstance, '_onIntroScroll' as any);

                directiveInstance.onWindowScroll();

                expectSpyCall(onIntroScrollSpy, 1);
                vi.advanceTimersByTime(200);
            });

            it('... should respect throttle time and not trigger multiple times immediately', () => {
                const scrollSpy = vi.spyOn(directiveInstance, '_onIntroScroll' as any);

                directiveInstance.onWindowScroll();
                directiveInstance.onWindowScroll();

                expectSpyCall(scrollSpy, 1);
                vi.advanceTimersByTime(200);
            });
        });

        describe('#_onIntroScroll()', () => {
            it('... should have a method `_onIntroScroll`', () => {
                expect(directiveInstance['_onIntroScroll']).toBeDefined();
            });

            it('... should update nav link classes based on window.scrollY', () => {
                vi.spyOn(globalThis, 'scrollY', 'get').mockReturnValue(150);

                directiveInstance['_onIntroScroll']();

                expectToContain(navLink1.classList, 'active');
                expectToNotContain(navLink2.classList, 'active');
            });

            it('... should update nav link classes based on document.documentElement.scrollTop', () => {
                vi.spyOn(globalThis, 'scrollY', 'get').mockReturnValue(0);
                Object.defineProperty(document.documentElement, 'scrollTop', {
                    value: 150,
                    writable: true,
                    configurable: true,
                });

                directiveInstance['_onIntroScroll']();

                expectToContain(navLink1.classList, 'active');
                expectToNotContain(navLink2.classList, 'active');
            });

            it('... should remove active class from all links if position matches no section', () => {
                navLink1.classList.add('active');
                navLink2.classList.add('active');

                vi.spyOn(globalThis, 'scrollY', 'get').mockReturnValue(0);
                Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, configurable: true });

                directiveInstance['_onIntroScroll']();

                expectToNotContain(navLink1.classList, 'active');
                expectToNotContain(navLink2.classList, 'active');
            });
        });
    });
});
