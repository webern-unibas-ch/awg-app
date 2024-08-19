/* eslint-disable @typescript-eslint/no-unused-vars */
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { PageNotFoundViewComponent } from './page-not-found-view.component';

describe('PageNotFoundViewComponent (DONE)', () => {
    let component: PageNotFoundViewComponent;
    let fixture: ComponentFixture<PageNotFoundViewComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    const expectedPageNotFoundTitle = 'Entschuldigung, diese Seite gibt es hier nicht…';
    const expectedPageNotFoundSubTitle = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';
    const expectedPageNotFoundImgPath = 'assets/img/page-not-found/Webern_Books.jpg';
    const expectedAwgContactUrl = 'https://www.anton-webern.ch/index.php?id=41';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PageNotFoundViewComponent, RouterLinkStubDirective],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageNotFoundViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have pageNotFoundTitle and pageNotFoundSubtitle', () => {
            expectToBe(component.pageNotFoundTitle, expectedPageNotFoundTitle);
            expectToBe(component.pageNotFoundSubTitle, expectedPageNotFoundSubTitle);
        });

        it('... should have correct values from getters', () => {
            expectToBe(component.pageNotFoundImgPath, expectedPageNotFoundImgPath);
            expectToBe(component.awgContactUrl, expectedAwgContactUrl);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-page-not-found`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found', 1, 1);
            });

            it('... should contain one `h2` title and on `h5` subtitle', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > h2', 1, 1);

                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > h5', 1, 1);
            });

            it('... should contain one body with text-centered div', () => {
                getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found > div.awg-page-not-found-body.text-center',
                    1,
                    1
                );
            });

            it('... should contain one div with img (empty yet) in body', () => {
                const imgDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-body > div.awg-page-not-found-image > img',
                    1,
                    1
                );
                const imgEl = imgDes[0].nativeElement;

                expectToBe(imgEl.src, '');
            });

            it('... should contain 2 paragraphs (contact and back) in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-page-not-found-body > p', 2, 2);
                getAndExpectDebugElementByCss(bodyDes[0], 'p#awg-page-not-found-contact', 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'p#awg-page-not-found-back', 1, 1);
            });

            it('... should not render pageNotFoundTitle or pageNotFoundSubtitle yet', () => {
                const titleDes = getAndExpectDebugElementByCss(compDe, 'h2#awg-page-not-found-title', 1, 1);
                const titleEl = titleDes[0].nativeElement;

                const subtitleDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-page-not-found-subtitle', 1, 1);
                const subtitleEl = subtitleDes[0].nativeElement;

                expectToBe(titleEl.textContent, '');
                expectToBe(subtitleEl.textContent, '');
            });

            it('... should not render contact url yet', () => {
                const contactDes = getAndExpectDebugElementByCss(compDe, 'p#awg-page-not-found-contact > a', 1, 1);
                const contactEl = contactDes[0].nativeElement;

                expectToBe(contactEl.href, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render pageNotFoundTitle in the `h2`-element', () => {
                const titleDes = getAndExpectDebugElementByCss(compDe, 'h2#awg-page-not-found-title', 1, 1);
                const titleEl = titleDes[0].nativeElement;

                expectToContain(titleEl.textContent, expectedPageNotFoundTitle);
            });

            it('... should render pageNotFoundSubTitle in the `h5`-element', () => {
                const subtitleDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-page-not-found-subtitle', 1, 1);
                const subtitleEl = subtitleDes[0].nativeElement;

                expectToContain(subtitleEl.textContent, expectedPageNotFoundSubTitle);
            });

            it('... should render image', () => {
                const imgDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-image > img', 1, 1);
                const imgEl = imgDes[0].nativeElement;

                expectToContain(imgEl.src, expectedPageNotFoundImgPath);
            });

            it('... should render contact url', () => {
                const contactDes = getAndExpectDebugElementByCss(compDe, 'p#awg-page-not-found-contact > a', 1, 1);
                const contactEl = contactDes[0].nativeElement;

                expectToContain(contactEl.href, expectedAwgContactUrl);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // Find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                expectToEqual(routerLinks[0].linkParams, ['/home']);
            });

            it('... can click home link in template', () => {
                const homeLinkDe = linkDes[0]; // Home link DebugElement
                const homeLink = routerLinks[0]; // Home link directive

                expectToBe(homeLink.navigatedTo, null);

                click(homeLinkDe);
                fixture.detectChanges();

                expectToEqual(homeLink.navigatedTo, ['/home']);
            });
        });
    });
});
