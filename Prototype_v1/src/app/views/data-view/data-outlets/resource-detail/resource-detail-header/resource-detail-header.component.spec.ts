import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { click } from '@testing/click-helper';

import Spy = jasmine.Spy;
import { CompileHtmlComponent } from '@awg-shared/compile-html';

import { ResourceDetailHeader } from '@awg-views/data-view/models';
import { ResourceDetailHeaderComponent } from './resource-detail-header.component';

fdescribe('ResourceDetailHtmlHeaderComponent', () => {
    let component: ResourceDetailHeaderComponent;
    let fixture: ComponentFixture<ResourceDetailHeaderComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let navigateToResourceSpy: Spy;
    let emitSpy: Spy;

    let expectedHeader: ResourceDetailHeader;
    let expectedResourceUrl: string;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourceDetailHeaderComponent, CompileHtmlComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHeaderComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        const objId = '1234';
        const icon = 'test-icon';
        const type = 'test-type';
        const title = `<a (click)="ref.navigateToResource()">Op. 28</a>: Skizzen zu einem "1. Satz"<a (click)="ref.navigateToResource('28')"> (später 2. Satz [<a (click)="ref.navigateToResource(330)">M 330</a>])`;
        const lastmod = 'today';

        expectedHeader = { objID: objId, icon: icon, type: type, title: title, lastmod: lastmod };
        expectedResourceUrl = 'http://example.com/123';

        // spies on component functions
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
            expect(component.header).toBeUndefined('should be undefined');
            expect(component.resourceUrl).toBeUndefined('should be undefined');
        });

        describe('#navigateToResource', () => {
            it('... should not have been called', () => {
                expect(component.navigateToResource).not.toHaveBeenCalled();
            });
        });

        describe('VIEW', () => {
            it('... should contain one div.resource-header', () => {
                const rHeaderEl = compEl.querySelectorAll('div.resource-header');

                expect(rHeaderEl).toBeDefined();
                expect(rHeaderEl.length).toBe(1, 'should have one `div.resource-header`');
            });

            it('... should contain one div.row with two div.cols', () => {
                const rowEl = compEl.querySelectorAll('div.resource-header > div.row');
                const col8El = compEl.querySelectorAll('div.row > div.col-lg-8');
                const col4El = compEl.querySelectorAll('div.row > div.col-lg-4');

                expect(rowEl).toBeDefined();
                expect(rowEl.length).toBe(1, 'should have one div.row');

                expect(col8El).toBeDefined();
                expect(col8El.length).toBe(1, 'should have one div.col-lg-8');

                expect(col4El).toBeDefined();
                expect(col4El.length).toBe(1, 'should have one div.col-lg-4');
            });

            it('... should contain one h2.resource-title with div.title and div.subtitle', () => {
                const rtEl = compEl.querySelectorAll('div.col-lg-8 > h2.resource-title');
                const titleEl = compEl.querySelectorAll('h2.resource-title > div.title');
                const subTitleEl = compEl.querySelectorAll('h2.resource-title > div.subtitle');

                expect(rtEl).toBeDefined();
                expect(rtEl.length).toBe(1, 'should have one h2.resource-title');

                expect(titleEl).toBeDefined();
                expect(titleEl.length).toBe(1, 'should have one div.title');

                expect(subTitleEl).toBeDefined();
                expect(subTitleEl.length).toBe(1, 'should have one div.subtitle');
            });

            it('... should contain span in div.title with compile html component', () => {
                const titleDe = compDe.queryAll(By.css('h2.resource-title > div.title'));
                // find DebugElements with an attached CompileHtmlComponent
                const htmlDes = titleDe[0].queryAll(By.directive(CompileHtmlComponent));
                // find anchor links of CompileHtmlComponent
                const anchorDes = htmlDes[0].queryAll(By.css('a'));

                expect(htmlDes).toBeDefined();
                expect(htmlDes.length).toBe(1, 'should have one compile html component');
                expect(htmlDes[0].name).toBe('span');

                expect(anchorDes).toEqual([], 'should be empty (no inner html yet)');
            });

            it('... should contain one div.resource-link (empty yet)', () => {
                const rLinkEl = compEl.querySelectorAll('div.col-lg-8 > div.resource-link');

                expect(rLinkEl).toBeDefined();
                expect(rLinkEl.length).toBe(1, 'should have one div.resource-link');
                expect(rLinkEl[0].textContent).toBe(
                    ' API-Request: ',
                    `should be ' API-Request: ${expectedResourceUrl}'`
                );
            });

            it('... should contain one table.resource-header-table', () => {
                const rhTableEl = compEl.querySelectorAll('table.resource-header-table');

                expect(rhTableEl).toBeDefined();
                expect(rhTableEl.length).toBe(1, 'should have one `table.resource-header-table`');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // simulate the parent setting the input properties
            component.header = expectedHeader;
            component.resourceUrl = expectedResourceUrl;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should have `header` or `resourceUrl` inputs', () => {
            expect(component.header).toBeDefined('should be defined');
            expect(component.header).toBe(expectedHeader);

            expect(component.resourceUrl).toBeDefined('should be defined');
            expect(component.resourceUrl).toBe(expectedResourceUrl);
        });

        describe('VIEW', () => {
            it('... should render header title in compile html component span', () => {
                // find DebugElements with an attached CompileHtmlComponent
                const htmlDes = compDe.queryAll(By.directive(CompileHtmlComponent));
                const expectedTitle = 'Op. 28: Skizzen zu einem "1. Satz" (später 2. Satz [M 330])';

                expect(htmlDes).toBeDefined();
                expect(htmlDes.length).toBe(1, 'should have one compile html component');

                expect(htmlDes[0].name).toBe('span');
                expect(htmlDes[0].nativeElement.textContent).toBe(expectedTitle, `should be ${expectedTitle}`);
            });

            it('... should have 3 anchor links in compile html component span', () => {
                // find DebugElements with an attached CompileHtmlComponent
                const htmlDes = compDe.queryAll(By.directive(CompileHtmlComponent));
                // find anchor links of CompileHtmlComponent
                const anchorDes = htmlDes[0].queryAll(By.css('a'));

                expect(anchorDes.length).toBe(3, 'should have 3 anchor links');
            });

            it('... should render other header values in table', () => {
                // find debug elements
                const rhTableDes = compDe.queryAll(By.css('table.resource-header-table'));
                const tdDes = rhTableDes[0].queryAll(By.css('td'));
                const imgDes = tdDes[1].queryAll(By.css('img'));

                expect(tdDes.length).toBe(3, 'should have 3 td elements');
                expect(imgDes.length).toBe(1, 'should have one img');

                // TODO: weiter
                const img = imgDes[0].nativeElement.textContent;

                console.log(imgDes[0]);

                expect(tdDes[0].nativeElement.textContent).toBe(
                    expectedHeader.objID,
                    `should be ${expectedHeader.objID}`
                );
                expect(tdDes[1].nativeElement.textContent).toBe(
                    expectedHeader.type + ' ' + img,
                    `should be ${expectedHeader.type}`
                );
                expect(tdDes[2].nativeElement.textContent).toBe(
                    expectedHeader.lastmod + ' (UTC)',
                    `should be '${expectedHeader.lastmod} (UTC)'`
                );
            });

            it('... should render resourceUrl in div.resource-link', () => {
                const rLinkEl = compEl.querySelectorAll('div.resource-link');

                expect(rLinkEl[0].textContent).toEqual(
                    ' API-Request: ' + expectedResourceUrl,
                    `should be ' API-Request: ${expectedResourceUrl}'`
                );
            });
        });

        describe('#navigateToResource', () => {
            // helper functions
            function clickAndDetectChanges(clickDe: DebugElement) {
                // trigger click with click helper
                click(clickDe);

                // wait for changes
                flush();
                fixture.detectChanges();
            }

            function expectSpyCall(spy: Spy, nTimes: number, expectedValue: any) {
                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledTimes(nTimes);
                expect(spy.calls.mostRecent().args[0]).toBe(expectedValue);
            }

            it('... should trigger on click', fakeAsync(() => {
                const htmlDes = compDe.queryAll(By.directive(CompileHtmlComponent));
                const anchorDes = htmlDes[0].queryAll(By.css('a'));

                expect(anchorDes.length).toBe(3, 'should have 3 anchor links');

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(anchorDes[0]);

                // no id
                expectSpyCall(navigateToResourceSpy, 1, undefined);
                // trigger click with click helper & wait for changes
                clickAndDetectChanges(anchorDes[1]);

                // number
                expectSpyCall(navigateToResourceSpy, 2, '28');

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(anchorDes[2]);

                // string
                expectSpyCall(navigateToResourceSpy, 3, 330);
            }));

            it('... should not emit anything if no id is provided', fakeAsync(() => {
                const htmlDes = compDe.queryAll(By.directive(CompileHtmlComponent));
                const anchorDes = htmlDes[0].queryAll(By.css('a'));

                expect(anchorDes.length).toBe(3, 'should have 3 anchor links');

                // first anchor has no id

                // trigger click with click helper & wait for changes
                clickAndDetectChanges(anchorDes[0]);

                expect(emitSpy).not.toHaveBeenCalled();
                expect(emitSpy).toHaveBeenCalledTimes(0);
            }));

            it('... should emit provided resource id (as string) on click', fakeAsync(() => {
                const htmlDes = compDe.queryAll(By.directive(CompileHtmlComponent));
                const anchorDes = htmlDes[0].queryAll(By.css('a'));

                expect(anchorDes.length).toBe(3, 'should have 3 anchor links');

                // first anchor has no id, see above

                // second anchor has @id: number
                // trigger click with click helper & wait for changes
                clickAndDetectChanges(anchorDes[1]);

                expectSpyCall(emitSpy, 1, '28');

                // third anchor has @id: string
                // trigger click with click helper & wait for changes
                clickAndDetectChanges(anchorDes[2]);

                expectSpyCall(emitSpy, 2, '330');
            }));
        });
    });
});
