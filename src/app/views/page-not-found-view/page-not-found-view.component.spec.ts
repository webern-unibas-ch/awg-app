/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { click } from '@testing/click-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { PageNotFoundViewComponent } from './page-not-found-view.component';

describe('PageNotFoundViewComponent (DONE)', () => {
    let component: PageNotFoundViewComponent;
    let fixture: ComponentFixture<PageNotFoundViewComponent>;
    let compDe: DebugElement;
    let compEl: any;
    let linkDes: DebugElement[];
    let routerLinks;

    const expectedTitle = 'Entschuldigung, diese Seite gibt es hier nicht…';
    const expectedSubtitle = '… aber möglicherweise können wir Ihnen anders weiterhelfen?';
    const expectedImgPath = 'assets/img/page-not-found/Webern_Books.jpg';
    const expectedAwgUrl = 'https://www.anton-webern.ch/index.php?id=41';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PageNotFoundViewComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PageNotFoundViewComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it(`should have title and subtitle`, () => {
            expect(component.title).toBe(expectedTitle);
            expect(component.subtitle).toBe(expectedSubtitle);
        });

        it('should have correct values from getters', () => {
            expect(component.imgPath).toBe(expectedImgPath);
            expect(component.awgUrl).toBe(expectedAwgUrl);
        });

        describe('VIEW', () => {
            it('... should contain one `div.awg-page-not-found`', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found', 1, 1);
            });

            it('... should contain one `h2` element', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > h2', 1, 1);
            });

            it('... should contain three `h5` elements', () => {
                getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > h5', 3, 3);
            });

            it('... should contain one div with img (empty yet)', () => {
                const imgDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > div > img', 1, 1);
                const imgEl = imgDes[0].nativeElement;

                expect(imgEl.src).toBeDefined();
                expect(imgEl.src).toBe('', 'should be empty string');
            });

            it('... should not render title or subtitle yet', () => {
                const h2Des = getAndExpectDebugElementByCss(compDe, 'h2', 1, 1);
                const h2El = h2Des[0].nativeElement;

                expect(h2El.textContent).toBeDefined();
                expect(h2El.textContent).not.toContain(expectedSubtitle);
            });

            it('... should not render contact url yet', () => {
                // second h5 should have an anchor link
                const contactDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-page-not-found-contact > a', 1, 1);
                const contactEl = contactDes[0].nativeElement;

                expect(contactEl.href).toBeDefined();
                expect(contactEl.href).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render title in the `h2`-element', () => {
                const h2Des = getAndExpectDebugElementByCss(compDe, 'h2', 1, 1);
                const h2El = h2Des[0].nativeElement;

                expect(h2El.textContent).toBeDefined();
                expect(h2El.textContent).toContain(expectedTitle, `should contain ${expectedTitle}`);
            });

            it('... should render image', () => {
                const imgDes = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > div > img', 1, 1);
                const imgEl = imgDes[0].nativeElement;

                expect(imgEl.src).toBeDefined();
                expect(imgEl.src).toContain(expectedImgPath);
            });

            it('... should render contact linkt', () => {
                const h5Des = getAndExpectDebugElementByCss(compDe, 'div.awg-page-not-found > h5', 3, 3);

                // second h5 should have an anchor link with href
                const contactDes = getAndExpectDebugElementByCss(h5Des[1], 'a[href]', 1, 1);
                const contactEl = contactDes[0].nativeElement;

                expect(contactEl.href).toBeDefined();
                expect(contactEl.href).toBe(expectedAwgUrl);
            });
        });

        describe('[routerLink]', () => {
            beforeEach(() => {
                // find DebugElements with an attached RouterLinkStubDirective
                linkDes = getAndExpectDebugElementByDirective(compDe, RouterLinkStubDirective, 1, 1);

                // get attached link directive instances using each DebugElement's injector
                routerLinks = linkDes.map(de => de.injector.get(RouterLinkStubDirective));
            });

            it('... can get routerLink from template', () => {
                expect(routerLinks.length).toBe(1, 'should have 1 routerLink');
                expect(routerLinks[0].linkParams).toEqual(['/home']);
            });

            it('... can click home link in template', () => {
                const homeLinkDe = linkDes[0]; // home link DebugElement
                const homeLink = routerLinks[0]; // home link directive

                expect(homeLink.navigatedTo).toBeNull('should not have navigated yet');

                click(homeLinkDe);
                fixture.detectChanges();

                expect(homeLink.navigatedTo).toEqual(['/home']);
            });
        });
    });
});
