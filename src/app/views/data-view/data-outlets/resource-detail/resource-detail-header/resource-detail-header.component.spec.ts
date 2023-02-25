import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';

import { clickAndAwaitChanges } from '@testing/click-helper';
import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import Spy = jasmine.Spy;

import { CompileHtmlComponent } from '@awg-shared/compile-html';
import { ResourceDetailHeader } from '@awg-views/data-view/models';

import { ResourceDetailHeaderComponent } from './resource-detail-header.component';

describe('ResourceDetailHtmlHeaderComponent (DONE)', () => {
    let component: ResourceDetailHeaderComponent;
    let fixture: ComponentFixture<ResourceDetailHeaderComponent>;
    let compDe: DebugElement;

    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    let expectedHeader: ResourceDetailHeader;
    let expectedResourceUrl: string;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHeaderComponent, CompileHtmlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHeaderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        const objID = '1234';
        const icon = '/assets/img/logos/angular.png';
        const type = 'test-type';
        const title =
            '<a (click)="ref.navigateToResource()">Op. 28</a>: Skizzen zu einem "1. Satz"<a (click)="ref.navigateToResource(\'28\')"> (später 2. Satz [<a (click)="ref.navigateToResource(330)">M 330</a>])';
        const lastmod = 'today';

        expectedHeader = { objID, icon, type, title, lastmod };
        expectedResourceUrl = 'https://example.com/123';

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        navigateToResourceSpy = spyOn(component, 'navigateToResource').and.callThrough();
        emitSpy = spyOn(component.resourceRequest, 'emit').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have `header` or `resourceUrl` inputs', () => {
            expect(component.header).toBeUndefined();
            expect(component.resourceUrl).toBeUndefined();
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(navigateToResourceSpy).not.toHaveBeenCalled();
                expect(emitSpy).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.resource-header', () => {
                getAndExpectDebugElementByCss(compDe, 'div.resource-header', 1, 1);
            });

            it('... should contain one div.row with two div.cols', () => {
                getAndExpectDebugElementByCss(compDe, 'div.resource-header > div.row', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.row > div.col-lg-8', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.row > div.col-lg-4', 1, 1);
            });

            it('... should contain one h2.resource-title with div.title and div.subtitle', () => {
                getAndExpectDebugElementByCss(compDe, 'div.col-lg-8 > h2.resource-title', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'h2.resource-title > div.title', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'h2.resource-title > div.subtitle', 1, 1);
            });

            it('... should contain span in div.title with compile html component with no inner html yet', () => {
                const titleDe = getAndExpectDebugElementByCss(compDe, 'h2.resource-title > div.title', 1, 1);

                // Find DebugElements with an attached CompileHtmlComponent
                const htmlDes = getAndExpectDebugElementByDirective(titleDe[0], CompileHtmlComponent, 1, 1);
                expect(htmlDes[0].name).toBe('span');

                // Find anchor links of CompileHtmlComponent
                getAndExpectDebugElementByCss(htmlDes[0], 'a', 0, 0);
            });

            it('... should contain one div.resource-link (empty yet)', () => {
                const rLinkDe = getAndExpectDebugElementByCss(compDe, 'div.col-lg-8 > div.resource-link', 1, 1);
                const rLinkEl = rLinkDe[0].nativeElement;

                expect(rLinkEl.textContent).toBeDefined();
                expect(rLinkEl.textContent).withContext(`should contain ' API-Request: '`).toContain(' API-Request: ');
            });

            it('... should contain one table.resource-header-table', () => {
                getAndExpectDebugElementByCss(compDe, 'table.resource-header-table', 1, 1);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.header = expectedHeader;
            component.resourceUrl = expectedResourceUrl;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `header` or `resourceUrl` inputs', () => {
            expect(component.header).toBeDefined();
            expect(component.header).withContext(`should be ${expectedHeader}`).toBe(expectedHeader);

            expect(component.resourceUrl).toBeDefined();
            expect(component.resourceUrl).withContext(`should be ${expectedResourceUrl}`).toBe(expectedResourceUrl);
        });

        describe('VIEW', () => {
            it('... should render header title in compile html component span', () => {
                const expectedTitle = 'Op. 28: Skizzen zu einem "1. Satz" (später 2. Satz [M 330])';

                // Find DebugElements with an attached CompileHtmlComponent
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 1, 1);
                const htmlEl = htmlDes[0].nativeElement;

                expect(htmlDes[0].name).toBeDefined();
                expect(htmlDes[0].name).withContext(`should be 'span'`).toBe('span');

                expect(htmlEl.textContent).toBeDefined();
                expect(htmlEl.textContent).withContext(`should contain ${expectedTitle}`).toContain(expectedTitle);
            });

            it('... should have 3 anchor links in compile html component span', () => {
                // Find DebugElements with an attached CompileHtmlComponent
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 1, 1);
                // Find anchor links of CompileHtmlComponent
                getAndExpectDebugElementByCss(htmlDes[0], 'a', 3, 3);
            });

            it('... should render other header values in table', () => {
                // Find debug elements
                const rhTableDes = getAndExpectDebugElementByCss(compDe, 'table.resource-header-table', 1, 1);
                const tdDes = getAndExpectDebugElementByCss(rhTableDes[0], 'td', 3, 3);
                const typeDes = getAndExpectDebugElementByCss(tdDes[1], 'span.resource-type', 1, 1);
                const imgDes = getAndExpectDebugElementByCss(tdDes[1], 'span.resource-icon > img', 1, 1);
                const lastModDes = getAndExpectDebugElementByCss(tdDes[2], 'span.resource-lastmod', 1, 1);

                // Find native elements
                const tdEl = tdDes[0].nativeElement;
                const typeEl = typeDes[0].nativeElement;
                const imgEl = imgDes[0].nativeElement;
                const lastModEl = lastModDes[0].nativeElement;

                // Check output
                expect(tdEl.textContent).toBeTruthy();
                expect(tdEl.textContent)
                    .withContext(`should contain ${expectedHeader.objID}`)
                    .toContain(expectedHeader.objID);

                expect(typeEl.textContent).toBeTruthy();
                expect(typeEl.textContent)
                    .withContext(`should contain ${expectedHeader.type}`)
                    .toContain(expectedHeader.type);

                expect(imgEl.src).toBeTruthy();
                expect(imgEl.src).withContext(`should be ${expectedHeader.icon}`).toContain(expectedHeader.icon);

                expect(lastModEl.textContent).toBeTruthy();
                expect(lastModEl.textContent)
                    .withContext(`should contain '${expectedHeader.lastmod}'`)
                    .toContain(expectedHeader.lastmod);
            });

            it('... should render resourceUrl in div.resource-link', () => {
                const rLinkDe = getAndExpectDebugElementByCss(compDe, 'div.resource-link', 1, 1);
                const rLinkEl = rLinkDe[0].nativeElement;

                expect(rLinkEl.textContent).toBeTruthy();
                expect(rLinkEl.textContent)
                    .withContext(`should contain ' API-Request: ${expectedResourceUrl}'`)
                    .toContain(' API-Request: ' + expectedResourceUrl);
            });
        });

        describe('#navigateToResource', () => {
            it('... should trigger on click', fakeAsync(() => {
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(htmlDes[0], 'a', 3, 3);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                // No id
                expectSpyCall(navigateToResourceSpy, 1, undefined);

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);
                // Number
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);
                // String
                expectSpyCall(navigateToResourceSpy, 3, 330);
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(htmlDes[0], 'a', 3, 3);

                // First anchor has no id

                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[0], fixture);

                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const htmlDes = getAndExpectDebugElementByDirective(compDe, CompileHtmlComponent, 1, 1);
                const anchorDes = getAndExpectDebugElementByCss(htmlDes[0], 'a', 3, 3);

                // First anchor has no id, see above

                // Second anchor has @id: number
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[1], fixture);

                expectSpyCall(emitSpy, 1, '28');

                // Third anchor has @id: string
                // Trigger click with click helper & wait for changes
                clickAndAwaitChanges(anchorDes[2], fixture);

                expectSpyCall(emitSpy, 2, '330');
            }));
        });
    });
});
