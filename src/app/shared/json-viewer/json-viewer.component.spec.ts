import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Input, NgModule } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { click } from '@testing/click-helper';
import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import { getAndExpectDebugElementByCss, getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { NgbConfig, NgbNavLink, NgbNavModule, NgbNavOutlet } from '@ng-bootstrap/ng-bootstrap';

import { ResourceFullResponseJson } from '@awg-shared/api-objects';

import { JsonViewerComponent } from './json-viewer.component';

// Helper functions for nav items
function getNavContents(fixture: ComponentFixture<any>): HTMLElement[] {
    const outletEl = fixture.debugElement.query(By.directive(NgbNavOutlet)).nativeElement;
    return Array.from(outletEl.children) as HTMLElement[];
}

function getNavLinks(fixture: ComponentFixture<any>): HTMLElement[] {
    return fixture.debugElement.queryAll(By.directive(NgbNavLink)).map(debugElement => debugElement.nativeElement);
}

function expectNavLinks(fixture: ComponentFixture<any>, expected: boolean[], shouldHaveNavItemClass = false) {
    const links = getNavLinks(fixture);

    expect(links.length).toBe(expected.length, `expected to find ${expected.length} links, but found ${links.length}`);

    links.forEach(({ classList }, i) => {
        expect(classList.contains('nav-link')).toBe(true, `link should have 'nav-link' class`);
        expect(classList.contains('active')).toBe(
            expected[i],
            `link should ${expected[i] ? '' : 'not'} have 'active' class`
        );
        expect(classList.contains('nav-item')).toBe(
            shouldHaveNavItemClass,
            `link should ${shouldHaveNavItemClass ? '' : 'not'} have 'nav-item' class`
        );
    });
}

function expectNavContents(fixture: ComponentFixture<any>, expected: string[], activeIndex = 0) {
    const contents = getNavContents(fixture);
    expect(contents.length).toBe(
        expected.length,
        `expected to find ${expected.length} contents, but found ${contents.length}`
    );

    for (let i = 0; i < expected.length; ++i) {
        expect(contents[i].classList.contains('active')).toBe(
            i === activeIndex,
            `content should ${i === activeIndex ? '' : 'not'} have 'active' class`
        );
    }
}

function expectNavPanel(fixture: ComponentFixture<any>, expectedLinks: boolean[], expectedContents: string[]) {
    expectNavLinks(fixture, expectedLinks, true);
    expectNavContents(fixture, expectedContents);
}

// Mock ngx-json-viewer component
@Component({ selector: 'ngx-json-viewer', template: '' })
class NgxJsonViewerStubComponent {
    @Input()
    json: ResourceFullResponseJson | {};
}

describe('JsonViewerComponent (DONE)', () => {
    let component: JsonViewerComponent;
    let fixture: ComponentFixture<JsonViewerComponent>;
    let compDe: DebugElement;

    let expectedHeader: string;
    let expectedData: ResourceFullResponseJson;

    // Global NgbConfigModule
    @NgModule({ imports: [NgbNavModule], exports: [NgbNavModule] })
    class NgbNavWithConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbNavWithConfigModule],
            declarations: [JsonViewerComponent, NgxJsonViewerStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JsonViewerComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
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
        it('should not have `jsonViewerData` and `jsonViewerHeader`', () => {
            expect(component.jsonViewerData).toBeUndefined();
            expect(component.jsonViewerHeader).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should contain one div.card with card-header and card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);
            });

            it('... should contain one ngbNav with two ngbNavItems inside card-body', () => {
                const bodyDe = getAndExpectDebugElementByCss(compDe, 'div.card > div.card-body', 1, 1);

                getAndExpectDebugElementByCss(bodyDe[0], 'nav[ngbNav]', 1, 1);
                const navLinkDes = getNavLinks(fixture);

                expect(navLinkDes).toBeTruthy();
                expect(navLinkDes.length).toBe(2, 'should have 2 navLinks');
            });

            it('... should have one Formatted and one Plain navItem and display titles', () => {
                const navLinks = getNavLinks(fixture);

                expect(navLinks[0].textContent).toBeDefined();
                expect(navLinks[0].textContent).toMatch(/Formatted/);

                expect(navLinks[1].textContent).toBeDefined();
                expect(navLinks[1].textContent).toMatch(/Plain/);
            });

            it('... should not render navItem content yet', () => {
                const navContent = getNavContents(fixture);

                expect(navContent.length).toBe(0);
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

                expect(navContent.length).toBe(1);
                expectNavPanel(fixture, [true, false], ['content1']);
            });

            it('... should change active navItem on click', async () => {
                const navLinks = getNavLinks(fixture);

                expectNavPanel(fixture, [true, false], ['content1']);

                click(navLinks[1] as HTMLElement);
                await detectChangesOnPush(fixture); // Replacement for fixture.detectChanges with OnPush

                expectNavPanel(fixture, [false, true], ['content2']);

                click(navLinks[0] as HTMLElement);
                await detectChangesOnPush(fixture); // Replacement for fixture.detectChanges with OnPush

                expectNavPanel(fixture, [true, false], ['content1']);
            });

            it('... should contain one ngx-json-viewer component (stubbed) only in Formatted view', async () => {
                const navLinks = getNavLinks(fixture);
                getAndExpectDebugElementByDirective(
                    compDe,
                    NgxJsonViewerStubComponent,
                    1,
                    1,
                    'in default (formatted) view'
                );

                click(navLinks[1] as HTMLElement);
                await detectChangesOnPush(fixture); // Replacement for fixture.detectChanges with OnPush

                getAndExpectDebugElementByDirective(compDe, NgxJsonViewerStubComponent, 0, 0, 'in plain view');
            });

            it('... should pass down `jsonViewerData` to ngx-json-viewer component in Formatted view', () => {
                const viewerDes = getAndExpectDebugElementByDirective(compDe, NgxJsonViewerStubComponent, 1, 0);
                const viewerCmp = viewerDes[0].injector.get(NgxJsonViewerStubComponent) as NgxJsonViewerStubComponent;

                expect(viewerCmp.json).toBeDefined();
                expect(viewerCmp.json).toEqual(expectedData, `should equal: ${expectedData}`);
            });

            it('... should render `jsonViewerData` in Plain view', async () => {
                const navLinks = getNavLinks(fixture);

                // Change navLink to plain view
                click(navLinks[1] as HTMLElement);
                await detectChangesOnPush(fixture); // Replacement for fixture.detectChanges with OnPush

                const navContent = getNavContents(fixture);

                const jsonPipe = new JsonPipe();
                const pipedData = jsonPipe.transform(expectedData);

                expect(navContent.length).toBe(1, 'should be 1');
                expect(navContent[0].textContent).toBeDefined();
                expect(navContent[0].textContent).toContain(pipedData, `should contain ${pipedData}`);
            });
        });
    });
});
