///<reference path="../../../testing/custom-matchers.d.ts"/>

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { customJasmineMatchers } from '@testing/custom-matchers';

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
        // add custom jasmine matchers (ToHaveCssClass)
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
                const cardDes = fixture.debugElement.queryAll(By.css('div.card'));
                const headerDes = fixture.debugElement.queryAll(By.css('div.card > div.card-header'));
                const bodyDes = fixture.debugElement.queryAll(By.css('div.card > div.card-body'));

                expect(cardDes).toBeTruthy();
                expect(cardDes.length).toBe(1, 'should have 1 div.card');

                expect(headerDes).toBeTruthy();
                expect(headerDes.length).toBe(1, 'should have 1 div.card-header');

                expect(bodyDes).toBeTruthy();
                expect(bodyDes.length).toBe(1, 'should have 1 div.card-body');
            });

            it('... should contain one tabset inside card-body', () => {
                const tabSetDes = fixture.debugElement.queryAll(By.css('ngb-tabset'));

                expect(tabSetDes).toBeTruthy();
                expect(tabSetDes.length).toBe(1, 'should have 1 ngb-tabset');
            });

            it('... should not contain ngx-json-viewer component (stubbed)', () => {
                const viewerDes = compDe.query(By.directive(NgxJsonViewerComponent));

                expect(viewerDes).not.toBeTruthy();
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
                const tabSetDes = fixture.debugElement.queryAll(By.css('ngb-tabset'));
                const tabDes = getTabTitles(fixture.nativeElement);

                expect(tabSetDes).toBeTruthy();
                expect(tabSetDes.length).toBe(1, 'should have 1 ngb-tabset');

                expect(tabDes).toBeTruthy();
                expect(tabDes.length).toBe(2, 'should have 2 tabs');
            });

            it('... should have one Formatted and one Plain tab and disply titles', () => {
                const tabTitles = getTabTitles(fixture.nativeElement);

                expect(tabTitles[0].textContent).toMatch(/Formatted/);
                expect(tabTitles[1].textContent).toMatch(/Plain/);
            });

            it('... should render tabs and select first tab (Formatted) by default', () => {
                const tabContent = getTabContent(fixture.nativeElement);

                expect(tabContent.length).toBe(1);
                expectTabs(fixture.nativeElement, [true, false]);
            });

            it('... should change active tab on tab title click', () => {
                const tabTitles = getTabTitles(fixture.nativeElement);

                (<HTMLElement>tabTitles[1]).click();
                fixture.detectChanges();
                expectTabs(fixture.nativeElement, [false, true]);

                (<HTMLElement>tabTitles[0]).click();
                fixture.detectChanges();
                expectTabs(fixture.nativeElement, [true, false]);
            });

            it('... should contain one ngx-json-viewer component (stubbed) only in Formatted view', () => {
                let viewerDes = compDe.queryAll(By.directive(NgxJsonViewerComponent));
                const tabTitles = getTabTitles(fixture.nativeElement);

                expect(viewerDes).toBeTruthy();
                expect(viewerDes.length).toBe(1, 'should have only one ngx-json viewer');

                (<HTMLElement>tabTitles[1]).click();
                fixture.detectChanges();

                viewerDes = compDe.queryAll(By.directive(NgxJsonViewerComponent));

                expect(viewerDes).toBeTruthy();
                expect(viewerDes.length).toBe(0, 'should have no ngx-json viewer');
            });

            it('... should pass down `jsonViewerData` to ngx-json-viewer component in Formatted view', () => {
                const viewerDe = compDe.query(By.directive(NgxJsonViewerComponent));
                const viewerCmp = viewerDe.injector.get(NgxJsonViewerComponent) as NgxJsonViewerComponent;

                expect(viewerCmp.json).toBeDefined();
                expect(viewerCmp.json).toBe(expectedData, `should have data: ${expectedData}`);
            });

            it('... should render `jsonViewerData` in Plain view', () => {
                const tabTitles = getTabTitles(fixture.nativeElement);

                // change tab to plain view
                (<HTMLElement>tabTitles[1]).click();
                fixture.detectChanges();

                const tabContent = getTabContent(fixture.nativeElement);
                const jsonPipe = new JsonPipe();
                const pipedData = jsonPipe.transform(expectedData);

                expect(tabContent).toBeDefined();
                expect(tabContent[0].textContent).toBe(pipedData, `should be ${pipedData}`);
            });
        });
    });
});
