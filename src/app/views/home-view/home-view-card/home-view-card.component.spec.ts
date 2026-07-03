import { DebugElement, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { faArrowRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { HomeViewCardComponent } from './home-view-card.component';
import { HomeViewCard, HomeViewCardExternalLink, HomeViewCardInternalLink } from './home-view-card.model';

describe('HomeViewCardComponent (DONE)', () => {
    let component: HomeViewCardComponent;
    let fixture: ComponentFixture<HomeViewCardComponent>;
    let compDe: DebugElement;

    let router: Router;

    let expectedInternalCardData: HomeViewCard;
    let expectedExternalCardData: HomeViewCard;
    let expectedFaArrowRight: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HomeViewCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        // Inject service
        router = TestBed.inject(Router);

        // Test data
        expectedInternalCardData = {
            title: 'Internal Test Title',
            text: 'Test Text',
            imgSrc: 'assets/img/home/edition_sample.jpg',
            imgAlt: 'Test Alt',
            link: { type: 'internal', route: ['/test', 'route'] },
            linkText: 'Test Link',
        };
        expectedExternalCardData = {
            title: 'External Test Title',
            text: 'Test Text',
            imgSrc: 'assets/img/home/external_sample.jpg',
            imgAlt: 'Test Alt',
            link: { type: 'external', href: 'https://openstreetmap.org' },
            linkText: 'Open Map',
        };

        expectedFaArrowRight = faArrowRight;

        // Create component fixture
        fixture = TestBed.createComponent(HomeViewCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should throw due to missing required input signal `cardData`', () => {
            expectToBe(isSignal(component.cardData), true);

            expect(() => component.cardData()).toThrow();
        });

        it('... should have `faArrowRight`', () => {
            expectToEqual(component.faArrowRight, expectedFaArrowRight);
        });

        describe('VIEW', () => {
            it('... should contain one shadowed, centered `div.awg-home-view-card`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const divEl: HTMLDivElement = divDes[0].nativeElement;

                expectToContain(divEl.classList, 'shadow');
                expectToContain(divEl.classList, 'text-center');
            });

            it('... should contain one empty `img` in `div.awg-home-view-card`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);

                const imgDes = getAndExpectDebugElementByCss(divDes[0], 'img', 1, 1);
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToBe(imgEl.src, '');
                expectToBe(imgEl.alt, '');
            });

            it('... should contain one `div.card-body` in `div.awg-home-view-card`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);
            });

            it('... should contain one empty h5 title in `div.card-body`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                const hDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, '');
            });

            it('... should contain one empty paragraph text in `div.card-body`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                const pDes = getAndExpectDebugElementByCss(bodyDes[0], 'p.card-text', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, '');
            });

            it('... should contain one empty `div.card-footer` in `div.awg-home-view-card`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);

                const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                const footerEl: HTMLDivElement = footerDes[0].nativeElement;

                expectToBe(footerEl.textContent, '');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('cardData', expectedInternalCardData);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `cardData` to hold the provided data', () => {
            expectToEqual(component.cardData(), expectedInternalCardData);
        });

        describe('VIEW', () => {
            it('... should display `img` in `div.awg-home-view-card`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);

                const imgDes = getAndExpectDebugElementByCss(divDes[0], 'img', 1, 1);
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToContain(imgEl.src, expectedInternalCardData.imgSrc);
                expectToBe(imgEl.alt, expectedInternalCardData.imgAlt);
            });

            it('... should display h5 title in `div.card-body`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                const hDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedInternalCardData.title);
            });

            it('... should display paragraph text in `div.card-body`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                const pDes = getAndExpectDebugElementByCss(bodyDes[0], 'p.card-text', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, expectedInternalCardData.text);
            });

            it('... should have one info link button in `div.card-footer with correct classes`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);

                const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.classList.length, 4);
                expectToContain(aEl.classList, 'btn');
                expectToContain(aEl.classList, 'btn-info');
                expectToContain(aEl.classList, 'text-light');
                expectToContain(aEl.classList, 'stretched-link');
            });

            it('... should render an INTERNAL link button with correct href path from route array', () => {
                fixture.componentRef.setInput('cardData', expectedInternalCardData);
                fixture.detectChanges();

                const aDes = getAndExpectDebugElementByCss(compDe, 'a.btn', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                const internalLink = expectedInternalCardData.link as HomeViewCardInternalLink;
                const expectedPath = internalLink?.route.join('/');

                expectToBe(aEl.getAttribute('href'), expectedPath);

                expectToBe(aEl.classList.length, 4);
                expectToContain(aEl.classList, 'btn');
                expectToContain(aEl.classList, 'btn-info');
                expectToContain(aEl.classList, 'text-light');
                expectToContain(aEl.classList, 'stretched-link');
            });

            it('... should render an EXTERNAL link button with correct raw href string', () => {
                fixture.componentRef.setInput('cardData', expectedExternalCardData);
                fixture.detectChanges();

                const aDes = getAndExpectDebugElementByCss(compDe, 'a.btn', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                const externalLink = expectedExternalCardData.link as HomeViewCardExternalLink;

                expectToBe(aEl.getAttribute('href'), externalLink?.href);

                expectToBe(aEl.classList.length, 4);
                expectToContain(aEl.classList, 'btn');
                expectToContain(aEl.classList, 'btn-info');
                expectToContain(aEl.classList, 'text-light');
                expectToContain(aEl.classList, 'stretched-link');
            });

            it('... should render the correct link type and path for internal and external links`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);

                const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                const linkData = expectedInternalCardData.link;
                if (linkData?.type === 'internal') {
                    const expectedPath = linkData.route.join('/');
                    expectToBe(aEl.getAttribute('href'), expectedPath);
                } else if (linkData?.type === 'external') {
                    expectToBe(aEl.getAttribute('href'), linkData.href);
                }
            });

            it('... should display arrow icon on the info link button', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);

                const faIconDes = getAndExpectDebugElementByCss(aDes[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDes[0].componentInstance.icon;

                expectToEqual(faIconIns(), faArrowRight);
            });

            it('... should display link text on the info link button', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                expectToBe(aEl.textContent.trim(), expectedInternalCardData.linkText);
            });
        });

        describe('[routerLink]', () => {
            let routerLinks: RouterLink[];
            let linkDes: DebugElement[];

            beforeEach(() => {
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLink, 1, 1);

                routerLinks = linkDes.map(de => de.injector.get(RouterLink));
            });

            it('... can get correct number of routerLinks from template', () => {
                expectToBe(routerLinks.length, 1);
            });

            it('... can get correct linkParams from template', () => {
                const internalLink = expectedInternalCardData.link as HomeViewCardInternalLink;
                const expectedRouterLink = internalLink.route.join('/');
                const urlTree = routerLinks[0].urlTree;

                expectToEqual(urlTree.toString(), expectedRouterLink);
            });

            it('... can click all links in template', async () => {
                const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
                navigateSpy.mockClear();

                const internalLink = expectedInternalCardData.link as HomeViewCardInternalLink;
                const expectedRouterLink = internalLink.route.join('/');
                const linkDe = linkDes[0];

                await clickAndAwaitChanges(linkDe, fixture);

                expect(navigateSpy).toHaveBeenCalled();
                const firstCallArgs = navigateSpy.mock.calls[0][0];
                const actualUrl = firstCallArgs.toString();

                expectToBe(actualUrl, expectedRouterLink);

                navigateSpy.mockRestore();
            });
        });
    });
});
