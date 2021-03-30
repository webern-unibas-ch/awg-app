/* tslint:disable-next-line no-reference */
///<reference path="../../../testing/custom-matchers.d.ts"/>

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { customJasmineMatchers } from '@testing/custom-matchers';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxJsonViewerComponent } from 'ngx-json-viewer';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { JsonViewerComponent } from './json-viewer.component';

// helper functions for nav items
function getNavLinks(nativeEl: HTMLElement) {
    return nativeEl.querySelectorAll('.nav-link.nav-item');
}

function getNavContent(nativeEl: HTMLElement) {
    return nativeEl.querySelectorAll('.tab-content .tab-pane');
}

function expectNavPanel(nativeEl: HTMLElement, active: boolean[], disabled?: boolean[]) {
    const navLinks = getNavLinks(nativeEl);
    const navContent = getNavContent(nativeEl);
    const anyNavsActive = active.reduce((prev, curr) => prev || curr, false);

    expect(navLinks.length).toBe(active.length);
    expect(navContent.length).toBe(anyNavsActive ? 1 : 0); // only 1 nav content in DOM at a time

    if (disabled) {
        expect(disabled.length).toBe(active.length);
    } else {
        disabled = new Array(active.length); // navItems are not disabled by default
    }

    for (let i = 0; i < active.length; i++) {
        if (active[i]) {
            expect(navLinks[i]).toHaveCssClass('active');
        } else {
            expect(navLinks[i]).not.toHaveCssClass('active');
        }

        if (disabled[i]) {
            expect(navLinks[i]).toHaveCssClass('disabled');
            expect(navLinks[i].getAttribute('aria-disabled')).toBe('true');
            expect(navLinks[i].getAttribute('tabindex')).toBe('-1');
        } else {
            expect(navLinks[i]).not.toHaveCssClass('disabled');
            expect(navLinks[i].getAttribute('aria-disabled')).toBe('false');
            expect(navLinks[i].getAttribute('tabindex')).toBeNull();
        }
    }
}

describe('JsonViewerComponent (DONE)', () => {
    let component: JsonViewerComponent;
    let fixture: ComponentFixture<JsonViewerComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let expectedHeader: string;
    let expectedData: ResourceFullResponseJson;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [NgbNavModule],
                declarations: [JsonViewerComponent, NgxJsonViewerComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        // add custom jasmine matchers (toHaveCssClass)
        jasmine.addMatchers(customJasmineMatchers);

        fixture = TestBed.createComponent(JsonViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedHeader = 'Converted JSON response from Salsah-API';
        expectedData = new ResourceFullResponseJson();
        expectedData.status = 1;
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `jsonViewerData` and `jsonViewerHeader`', () => {
            expect(component.jsonViewerData).toBeUndefined();
            expect(component.jsonViewerHeader).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.card with card-header and card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
            });

            it('... should contain one ngbNav in card-body with no nav links yet', () => {
                const bodyDe = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDe[0], 'nav[ngbNav]', 1, 1);

                const navLinkDes = getNavLinks(compEl);

                expect(navLinkDes).toBeTruthy();
                expect(navLinkDes.length).toBe(0, 'should not have any navLinks yet');
            });

            it('... should not contain ngx-json-viewer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.jsonViewerHeader = expectedHeader;
            component.jsonViewerData = expectedData;

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should contain one ngbNav with two ngbNavItems inside card-body', () => {
                const bodyDe = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDe[0], 'nav[ngbNav]', 1, 1);
                const navLinkDes = getNavLinks(compEl);

                expect(navLinkDes).toBeTruthy();
                expect(navLinkDes.length).toBe(2, 'should have 2 navLinks');
            });

            it('... should have one Formatted and one Plain navItem and display titles', () => {
                const navLinks = getNavLinks(compEl);

                expect(navLinks[0].textContent).toBeDefined();
                expect(navLinks[0].textContent).toMatch(/Formatted/);

                expect(navLinks[1].textContent).toBeDefined();
                expect(navLinks[1].textContent).toMatch(/Plain/);
            });

            it('... should render navItem content and select first navItem (Formatted) by default', () => {
                const navContent = getNavContent(compEl);

                expect(navContent.length).toBe(1);
                expectNavPanel(compEl, [true, false]);
            });

            it('... should change active navItem on click', () => {
                const navLinks = getNavLinks(compEl);

                click(navLinks[1] as HTMLElement);
                fixture.detectChanges();
                expectNavPanel(compEl, [false, true]);

                click(navLinks[0] as HTMLElement);
                fixture.detectChanges();
                expectNavPanel(compEl, [true, false]);
            });

            it('... should contain one ngx-json-viewer component (stubbed) only in Formatted view', () => {
                const navLinks = getNavLinks(compEl);
                getAndExpectDebugElementByDirective(
                    compDe,
                    NgxJsonViewerComponent,
                    1,
                    1,
                    'in default (formatted) view'
                );

                click(navLinks[1] as HTMLElement);
                fixture.detectChanges();

                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerComponent, 0, 0, 'in plain view');
            });

            it('... should pass down `jsonViewerData` to ngx-json-viewer component in Formatted view', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, NgxJsonViewerComponent, 1, 0);
                const viewerCmp = viewerDes[0].injector.get(NgxJsonViewerComponent) as NgxJsonViewerComponent;

                expect(viewerCmp.json).toBeDefined();
                expect(viewerCmp.json).toBe(expectedData, `should have data: ${expectedData}`);
            });

            it('... should render `jsonViewerData` in Plain view', () => {
                const navLinks = getNavLinks(compEl);

                // change navLink to plain view
                click(navLinks[1] as HTMLElement);
                fixture.detectChanges();

                const navContent = getNavContent(compEl);
                const jsonPipe = new JsonPipe();
                const pipedData = jsonPipe.transform(expectedData);

                expect(navContent[0].textContent).toBeDefined();
                expect(navContent[0].textContent).toContain(pipedData, `should contain ${pipedData}`);
            });
        });
    });
});
