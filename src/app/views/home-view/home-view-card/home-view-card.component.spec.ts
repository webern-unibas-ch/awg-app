import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faArrowRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { HomeViewCard } from '@awg-views/home-view/models';

import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { HomeViewCardComponent } from './home-view-card.component';

describe('HomeViewCardComponent (DONE)', () => {
    let component: HomeViewCardComponent;
    let fixture: ComponentFixture<HomeViewCardComponent>;
    let compDe: DebugElement;

    let linkDes: DebugElement[];
    let routerLinks;

    let expectedCardData: HomeViewCard;
    let expectedFaArrowRight: IconDefinition;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule],
            declarations: [HomeViewCardComponent, RouterLinkStubDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(HomeViewCardComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedCardData = {
            title: 'Test Title',
            text: 'Test Text',
            imgSrc: 'assets/img/home/edition_sample.jpg',
            imgAlt: 'Test Alt',
            linkRouter: ['/test', 'route'],
            linkText: 'Test Link',
        };
        expectedFaArrowRight = faArrowRight;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have cardData', () => {
            expect(component.cardData).toBeUndefined();
        });

        it('... should have faArrowRight', () => {
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
            // Simulate the parent setting the input properties
            component.cardData = expectedCardData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `cardData` input', () => {
            expectToEqual(component.cardData, expectedCardData);
        });

        describe('VIEW', () => {
            it('... should display `img` in `div.awg-home-view-card`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);

                const imgDes = getAndExpectDebugElementByCss(divDes[0], 'img', 1, 1);
                const imgEl: HTMLImageElement = imgDes[0].nativeElement;

                expectToContain(imgEl.src, expectedCardData.imgSrc);
                expectToBe(imgEl.alt, expectedCardData.imgAlt);
            });

            it('... should display h5 title in `div.card-body`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                const hDes = getAndExpectDebugElementByCss(bodyDes[0], 'h5.card-title', 1, 1);
                const hEl: HTMLHeadingElement = hDes[0].nativeElement;

                expectToBe(hEl.textContent, expectedCardData.title);
            });

            it('... should display paragraph text in `div.card-body`', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                const bodyDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-body', 1, 1);

                const pDes = getAndExpectDebugElementByCss(bodyDes[0], 'p.card-text', 1, 1);
                const pEl: HTMLParagraphElement = pDes[0].nativeElement;

                expectToBe(pEl.textContent, expectedCardData.text);
            });

            describe('... with routerLink', () => {
                it('... should have one info link button without href in `div.card-footer`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                    const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);

                    const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    expectToBe(aEl.href, '');

                    expectToContain(aEl.classList, 'btn');
                    expectToContain(aEl.classList, 'btn-info');
                    expectToContain(aEl.classList, 'text-light');
                });

                it('... should display arrow icon on the info link button', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                    const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                    const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);

                    const faIconDes = getAndExpectDebugElementByCss(aDes[0], 'fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, faArrowRight);
                });

                it('... should display link text on the info link button', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                    const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                    const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    expectToBe(aEl.textContent.trim(), expectedCardData.linkText);
                });
            });

            describe('... with href', () => {
                beforeEach(() => {
                    component.cardData.linkRouter = undefined;
                    component.cardData.linkHref = 'https://www.anton-webern.ch/';

                    detectChangesOnPush(fixture);
                });

                it('... should have one info link button with href in `div.card-footer`', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                    const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);

                    const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    expectToBe(aEl.href, expectedCardData.linkHref);

                    expectToContain(aEl.classList, 'btn');
                    expectToContain(aEl.classList, 'btn-info');
                    expectToContain(aEl.classList, 'text-light');
                });

                it('... should display arrow icon on the info link button', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                    const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                    const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);

                    const faIconDes = getAndExpectDebugElementByCss(aDes[0], 'fa-icon', 1, 1);
                    const faIconIns = faIconDes[0].componentInstance.icon;

                    expectToEqual(faIconIns, faArrowRight);
                });

                it('... should display link text on the info link button', () => {
                    const divDes = getAndExpectDebugElementByCss(compDe, 'div.awg-home-view-card', 1, 1);
                    const footerDes = getAndExpectDebugElementByCss(divDes[0], 'div.card-footer', 1, 1);
                    const aDes = getAndExpectDebugElementByCss(footerDes[0], 'a.btn', 1, 1);
                    const aEl: HTMLAnchorElement = aDes[0].nativeElement;

                    expectToBe(aEl.textContent.trim(), expectedCardData.linkText);
                });
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
                const expectedRouterLink = expectedCardData.linkRouter;
                expectToEqual(routerLinks[0].linkParams, expectedRouterLink);
            });

            it('... can click all links in template', () => {
                const linkDe = linkDes[0];
                const expectedRouterLink = expectedCardData.linkRouter;

                expectToBe(routerLinks[0].navigatedTo, null);

                click(linkDe);
                fixture.detectChanges();

                expectToEqual(routerLinks[0].navigatedTo, expectedRouterLink);
            });
        });
    });
});
