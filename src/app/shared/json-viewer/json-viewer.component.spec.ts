import { JsonPipe } from '@angular/common';
import { Component, DebugElement, Input, NgModule, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { beforeEach, describe, expect, it } from 'vitest';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { NgbConfig, NgbNavLink, NgbNavModule, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';

import { JsonViewerComponent } from './json-viewer.component';

// Helper functions for nav items
function getNavContents(fixture: ComponentFixture<any>): HTMLElement[] {
    const outletEl: HTMLElement = fixture.debugElement.query(By.directive(NgbNavOutlet)).nativeElement;
    return Array.from(outletEl.children) as HTMLElement[];
}

function getNavLinks(fixture: ComponentFixture<any>): DebugElement[] {
    return fixture.debugElement.queryAll(By.directive(NgbNavLink));
}

function expectNavLinks(fixture: ComponentFixture<any>, expected: boolean[], shouldHaveNavItemClass = false) {
    const linkDes = getNavLinks(fixture);

    expectToBe(linkDes.length, expected.length);

    linkDes.forEach((linkDe, i) => {
        const linkEl = linkDe.nativeElement;

        expectToContain(linkEl.classList, 'nav-link');

        if (expected[i]) {
            expectToContain(linkEl.classList, 'active');
        } else {
            expectToNotContain(linkEl.classList, 'active');
        }

        if (shouldHaveNavItemClass) {
            expectToContain(linkEl.classList, 'nav-item');
        } else {
            expectToNotContain(linkEl.classList, 'nav-item');
        }
    });
}

function expectNavContents(fixture: ComponentFixture<any>, expected: string[], activeIndex = 0) {
    const contents = getNavContents(fixture);
    expectToBe(contents.length, expected.length);

    for (let i = 0; i < expected.length; ++i) {
        if (i === activeIndex) {
            expectToContain(contents[i].classList, 'active');
        } else {
            expectToNotContain(contents[i].classList, 'active');
        }
    }
}

function expectNavPanel(fixture: ComponentFixture<any>, expectedLinks: boolean[], expectedContents: string[]) {
    expectNavLinks(fixture, expectedLinks, true);
    expectNavContents(fixture, expectedContents);
}

// Mock ngx-json-viewer component
@Component({
    selector: 'ngx-json-viewer',
    template: '',
    standalone: false,
})
class NgxJsonViewerStubComponent {
    @Input()
    json: unknown;
}

describe('JsonViewerComponent (DONE)', () => {
    let component: JsonViewerComponent;
    let fixture: ComponentFixture<JsonViewerComponent>;
    let compDe: DebugElement;

    let expectedHeader: string;
    let expectedData: unknown;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbNavModule], exports: [NgbNavModule] })
    class NgbConfigModule {
        constructor() {
            const config = inject(NgbConfig);

            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbNavModule, NgbConfigModule],
            declarations: [JsonViewerComponent, NgxJsonViewerStubComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedHeader = 'JSON Viewer Test Data';
        expectedData = {
            status: 1,
            message: 'Test response',
            data: {
                id: 123,
                name: 'Test Item',
                values: [1, 2, 3],
                metadata: {
                    created: '2026-03-04',
                    updated: '2026-03-04',
                },
            },
        };
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `jsonViewerData`', () => {
            expect(component.jsonViewerData).toBeUndefined();
        });

        it('... should have empty `jsonViewerHeader`', () => {
            expectToBe(component.jsonViewerHeader, '');
        });

        describe('VIEW', () => {
            it('... should contain one div.card with card-header and card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
            });

            it('... should contain one ngbNav with two ngbNavItems inside card-body', () => {
                const bodyDes = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDes[0], 'nav[ngbNav]', 1, 1);
                const navLinkDes = getNavLinks(fixture);

                expectToBe(navLinkDes.length, 2);
            });

            it('... should have one Formatted and one Plain navItem and display titles', () => {
                const navLinkDes = getNavLinks(fixture);
                const navLinks = navLinkDes.map(de => de.nativeElement);

                expectToBe(navLinks[0].textContent, 'Formatted');
                expectToBe(navLinks[1].textContent, 'Plain');
            });

            it('... should not render navItem content yet', () => {
                const navContent = getNavContents(fixture);

                expectToBe(navContent.length, 0);
            });

            it('... should not contain ngx-json-viewer component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerStubComponent, 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.jsonViewerHeader = expectedHeader;
            component.jsonViewerData = expectedData;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('VIEW', () => {
            it('... should render navItem content and select first navItem (Formatted) by default', () => {
                const navContent = getNavContents(fixture);

                expectToBe(navContent.length, 1);
                expectNavPanel(fixture, [true, false], ['content1']);
            });

            it('... should change active navItem on click', async () => {
                const navLinkDes = getNavLinks(fixture);

                expectNavPanel(fixture, [true, false], ['content1']);

                await clickAndAwaitChanges(navLinkDes[1], fixture);

                expectNavPanel(fixture, [false, true], ['content2']);

                await clickAndAwaitChanges(navLinkDes[0], fixture);

                expectNavPanel(fixture, [true, false], ['content1']);
            });

            it('... should contain one ngx-json-viewer component (stubbed) only in Formatted view', async () => {
                const navLinkDes = getNavLinks(fixture);
                getAndExpectDebugElementByDirective(
                    compDe,
                    NgxJsonViewerStubComponent,
                    1,
                    1,
                    'in default (formatted) view'
                );

                await clickAndAwaitChanges(navLinkDes[1], fixture);

                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerStubComponent, 0, 0, 'in plain view');
            });

            it('... should pass down `jsonViewerData` to ngx-json-viewer component in Formatted view', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, NgxJsonViewerStubComponent, 1, 1);
                const viewerCmp = viewerDes[0].injector.get(NgxJsonViewerStubComponent) as NgxJsonViewerStubComponent;

                expectToEqual(viewerCmp.json, expectedData);
            });

            it('... should render `jsonViewerData` in Plain view', async () => {
                const navLinkDes = getNavLinks(fixture);

                // Change navLink to plain view
                await clickAndAwaitChanges(navLinkDes[1], fixture);

                const navContent = getNavContents(fixture);

                const jsonPipe = new JsonPipe();
                const pipedData = jsonPipe.transform(expectedData);

                expectToBe(navContent.length, 1);
                expectToContain(navContent[0].textContent, pipedData);
            });
        });
    });
});
