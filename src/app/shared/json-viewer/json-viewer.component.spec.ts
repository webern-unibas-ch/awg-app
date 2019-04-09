/* tslint:disable-next-line no-reference */
///<reference path="../../../testing/custom-matchers.d.ts"/>

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { click } from '@testing/click-helper';
import { customJasmineMatchers } from '@testing/custom-matchers';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxJsonViewerComponent } from 'ngx-json-viewer';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { JsonViewerComponent } from './json-viewer.component';

// helper functions for tabs
// see https://github.com/ng-bootstrap/ng-bootstrap/blob/master/src/tabset/tabset.spec.ts
function getTabTitles(nativeEl: HTMLElement) {
    return nativeEl.querySelectorAll('.nav-link');
}

function getTabContent(nativeEl: HTMLElement) {
    return nativeEl.querySelectorAll('.tab-content .tab-pane');
}

function expectTabs(nativeEl: HTMLElement, active: boolean[], disabled?: boolean[]) {
    const tabTitles = getTabTitles(nativeEl);
    const tabContent = getTabContent(nativeEl);
    const anyTabsActive = active.reduce((prev, curr) => prev || curr, false);

    expect(tabTitles.length).toBe(active.length);
    expect(tabContent.length).toBe(anyTabsActive ? 1 : 0); // only 1 tab content in DOM at a time

    if (disabled) {
        expect(disabled.length).toBe(active.length);
    } else {
        disabled = new Array(active.length); // tabs are not disabled by default
    }

    for (let i = 0; i < active.length; i++) {
        if (active[i]) {
            expect(tabTitles[i]).toHaveCssClass('active');
        } else {
            expect(tabTitles[i]).not.toHaveCssClass('active');
        }

        if (disabled[i]) {
            expect(tabTitles[i]).toHaveCssClass('disabled');
            expect(tabTitles[i].getAttribute('aria-disabled')).toBe('true');
            expect(tabTitles[i].getAttribute('tabindex')).toBe('-1');
        } else {
            expect(tabTitles[i]).not.toHaveCssClass('disabled');
            expect(tabTitles[i].getAttribute('aria-disabled')).toBe('false');
            expect(tabTitles[i].getAttribute('tabindex')).toBeNull();
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

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NgbTabsetModule],
            declarations: [JsonViewerComponent, NgxJsonViewerComponent]
        }).compileComponents();
    }));

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `jsonViewerData` and `jsonViewerHeader`', () => {
            expect(component.jsonViewerData).toBeUndefined();
            expect(component.jsonViewerHeader).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one card with header and body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
            });

            it('... should contain one tabset inside card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'ngb-tabset', 1, 1);
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
            it('... should contain one tabset with two tabs inside card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'ngb-tabset', 1, 1);
                const tabDes = getTabTitles(compEl);

                expect(tabDes).toBeTruthy();
                expect(tabDes.length).toBe(2, 'should have 2 tabs');
            });

            it('... should have one Formatted and one Plain tab and display titles', () => {
                const tabTitles = getTabTitles(compEl);

                expect(tabTitles[0].textContent).toBeDefined();
                expect(tabTitles[0].textContent).toMatch(/Formatted/);

                expect(tabTitles[1].textContent).toBeDefined();
                expect(tabTitles[1].textContent).toMatch(/Plain/);
            });

            it('... should render tabs and select first tab (Formatted) by default', () => {
                const tabContent = getTabContent(compEl);

                expect(tabContent.length).toBe(1);
                expectTabs(compEl, [true, false]);
            });

            it('... should change active tab on tab title click', () => {
                const tabTitles = getTabTitles(compEl);

                click(tabTitles[1] as HTMLElement);
                fixture.detectChanges();
                expectTabs(compEl, [false, true]);

                click(tabTitles[0] as HTMLElement);
                fixture.detectChanges();
                expectTabs(compEl, [true, false]);
            });

            it('... should contain one ngx-json-viewer component (stubbed) only in Formatted view', () => {
                const tabTitles = getTabTitles(compEl);
                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerComponent, 1, 1);

                click(tabTitles[1] as HTMLElement);
                fixture.detectChanges();

                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerComponent, 0, 0);
            });

            it('... should pass down `jsonViewerData` to ngx-json-viewer component in Formatted view', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, NgxJsonViewerComponent, 1, 0);
                const viewerCmp = viewerDes[0].injector.get(NgxJsonViewerComponent) as NgxJsonViewerComponent;

                expect(viewerCmp.json).toBeDefined();
                expect(viewerCmp.json).toBe(expectedData, `should have data: ${expectedData}`);
            });

            it('... should render `jsonViewerData` in Plain view', () => {
                const tabTitles = getTabTitles(compEl);

                // change tab to plain view
                click(tabTitles[1] as HTMLElement);
                fixture.detectChanges();

                const tabContent = getTabContent(compEl);
                const jsonPipe = new JsonPipe();
                const pipedData = jsonPipe.transform(expectedData);

                expect(tabContent[0].textContent).toBeDefined();
                expect(tabContent[0].textContent).toContain(pipedData, `should contain ${pipedData}`);
            });
        });
    });
});
