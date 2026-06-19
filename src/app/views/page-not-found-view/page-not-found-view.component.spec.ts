import { Component, DebugElement, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { AppConfig } from '@awg-app/app.config';
import { HeadingComponent } from '@awg-shared/heading/heading.component';

import { PageNotFoundViewComponent } from './page-not-found-view.component';

// Mock components
@Component({
    selector: 'awg-heading',
    template: '',
})
class HeadingStubComponent {
    title = input<string>('');
    id = input<string>('');
}

describe('PageNotFoundViewComponent (DONE)', () => {
    let component: PageNotFoundViewComponent;
    let fixture: ComponentFixture<PageNotFoundViewComponent>;
    let compDe: DebugElement;

    let router: Router;

    const expectedPageNotFoundViewId = 'awg-page-not-found-view-heading';
    const expectedPageNotFoundViewTitle = 'Entschuldigung, diese Seite gibt es hier nicht…';
    const expectedPageNotFoundViewSubTitle = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';
    const expectedPageNotFoundViewImgPath = 'assets/img/page-not-found/Webern_Books.jpg';
    const expectedAwgContactUrl = AppConfig.AWG_PROJECT_URL + 'de/info/kontakt.html';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PageNotFoundViewComponent],
            providers: [provideRouter([])],
        })
            .overrideComponent(PageNotFoundViewComponent, {
                remove: { imports: [HeadingComponent] },
                add: { imports: [HeadingStubComponent] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PageNotFoundViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        router = TestBed.inject(Router);
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have PAGE_NOT_FOUND_ID', () => {
            expectToBe(component.PAGE_NOT_FOUND_VIEW_ID, expectedPageNotFoundViewId);
        });

        it('... should have PAGE_NOT_FOUND_TITLE and PAGE_NOT_FOUND_SUBTITLE', () => {
            expectToBe(component.PAGE_NOT_FOUND_VIEW_TITLE, expectedPageNotFoundViewTitle);
            expectToBe(component.PAGE_NOT_FOUND_VIEW_SUBTITLE, expectedPageNotFoundViewSubTitle);
        });

        it('... should have PAGE_NOT_FOUND_IMG_PATH', () => {
            expectToBe(component.PAGE_NOT_FOUND_VIEW_IMG_PATH, expectedPageNotFoundViewImgPath);
        });

        it('... should have AWG_CONTACT_URL', () => {
            expectToBe(component.AWG_CONTACT_URL, expectedAwgContactUrl);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-page-not-found-view`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view', 1, 1);
            });

            it('... should contain one `awg-heading` component in `div.awg-page-not-found-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should pass down empty default values to heading component (`id` and `title`)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.title(), '');
                expectToBe(headingCmp.id(), '');
            });

            it('... should contain one text-centered body', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                const bodyEl: HTMLDivElement = bodyDes[0].nativeElement;

                expectToContain(bodyEl.classList, 'text-center');
            });

            it('... should contain one `h5` subtitle in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(bodyDes[0], 'h5#awg-page-not-found-view-subtitle', 1, 1);
            });

            it('... should not render subtitle yet', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                const subtitleDes = getAndExpectDebugElementByCss(
                    bodyDes[0],
                    'h5#awg-page-not-found-view-subtitle',
                    1,
                    1
                );
                const subtitleEl: HTMLHeadingElement = subtitleDes[0].nativeElement;

                expectToBe(subtitleEl.textContent, '');
            });

            it('... should contain one div with img (empty yet) in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                const imgDes = getAndExpectDebugElementByCss(
                    bodyDes[0],
                    'div.awg-page-not-found-view-image > img',
                    1,
                    1
                );
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToBe(imgEl.src, '');
            });

            it('... should contain 2 paragraphs (contact and back) in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-page-not-found-view-body > p', 2, 2);
                getAndExpectDebugElementByCss(bodyDes[0], 'p#awg-page-not-found-view-contact', 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'p#awg-page-not-found-view-back', 1, 1);
            });

            it('... should not render contact url yet', () => {
                const contactDes = getAndExpectDebugElementByCss(compDe, 'p#awg-page-not-found-view-contact > a', 1, 1);
                const contactEl: HTMLAnchorElement = contactDes[0].nativeElement;

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
            it('... should contain one `awg-heading` component in `div.awg-page-not-found-view`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view', 1, 1);
                getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
            });

            it('... should pass down correct values to heading component (`id` and `title`)', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view', 1, 1);
                const headingDes = getAndExpectDebugElementByDirective(divDes[0], HeadingStubComponent, 1, 1);
                const headingCmp = headingDes[0].injector.get(HeadingStubComponent) as HeadingStubComponent;

                expectToBe(headingCmp.id(), expectedPageNotFoundViewId);
                expectToBe(headingCmp.title(), expectedPageNotFoundViewTitle);
            });

            it('... should contain one `h5` subtitle in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                getAndExpectDebugElementByCss(bodyDes[0], 'h5#awg-page-not-found-view-subtitle', 1, 1);
            });

            it('... should render subtitle', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                const subtitleDes = getAndExpectDebugElementByCss(
                    bodyDes[0],
                    'h5#awg-page-not-found-view-subtitle',
                    1,
                    1
                );
                const subtitleEl: HTMLHeadingElement = subtitleDes[0].nativeElement;

                expectToContain(subtitleEl.textContent, expectedPageNotFoundViewSubTitle);
            });

            it('... should contain one div with rendered img in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(
                    compDe,
                    'div.awg-page-not-found-view > div.awg-page-not-found-view-body',
                    1,
                    1
                );
                const imgDes = getAndExpectDebugElementByCss(
                    bodyDes[0],
                    'div.awg-page-not-found-view-image > img',
                    1,
                    1
                );
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToContain(imgEl.src, expectedPageNotFoundViewImgPath);
                expectToBe(imgEl.alt, 'Page not found');
            });

            it('... should contain 2 paragraphs (contact and back) in body', () => {
                const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found-view-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'div.awg-page-not-found-view-body > p', 2, 2);
                getAndExpectDebugElementByCss(bodyDes[0], 'p#awg-page-not-found-view-contact', 1, 1);
                getAndExpectDebugElementByCss(bodyDes[0], 'p#awg-page-not-found-view-back', 1, 1);
            });

            it('... should render contact url', () => {
                const contactDes = getAndExpectDebugElementByCss(compDe, 'p#awg-page-not-found-view-contact > a', 1, 1);
                const contactEl: HTMLAnchorElement = contactDes[0].nativeElement;

                expectToContain(contactEl.href, expectedAwgContactUrl);
            });
        });

        describe('[routerLink]', () => {
            let linkDes: DebugElement[];
            let routerLinks: RouterLink[];

            beforeEach(() => {
                // Find DebugElements with an attached RouterLink
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                // Get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                const urlTree = routerLinks[0].urlTree;
                expectToBe(urlTree.toString(), '/home');
            });

            it('... can click `home` link in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
                navigateSpy.mockClear();

                const homeLinkDe = linkDes[0];

                await clickAndAwaitChanges(homeLinkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const firstCallArg = navigateSpy.mock.calls[0][0];
                const actualUrl = firstCallArg.toString();

                expectToBe(actualUrl, '/home');

                navigateSpy.mockRestore();
            });
        });
    });
});
