import { DebugElement, DOCUMENT, isSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
type Spy = ReturnType<typeof vi.spyOn>;

import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap/pagination';

import { detectChangesOnPush } from '@testing/detect-changes-on-push-helper';
import {
    expectSpyCall,
    expectToBe,
    expectToContain,
    expectToEqual,
    expectToNotContain,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { TABLE_DEFAULT_PAGE_SIZE } from '../table.utils';
import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent (DONE)', () => {
    let component: TablePaginationComponent;
    let fixture: ComponentFixture<TablePaginationComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let onPageChangeSpy: Spy;
    let replaceNonNumberInputSpy: Spy;
    let selectPageSpy: Spy;

    let expectedCollectionSize: number;
    let expectedPage: number;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TablePaginationComponent],
        }).compileComponents();

        // Disable ng-bootstrap animations
        TestBed.inject(NgbConfig).animation = false;
    });

    beforeEach(() => {
        // Inject services
        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedCollectionSize = 100;
        expectedPage = 1;

        // Create component fixture
        fixture = TestBed.createComponent(TablePaginationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Component spies
        onPageChangeSpy = vi.spyOn(component, 'onPageChange');
        replaceNonNumberInputSpy = vi.spyOn(component, 'replaceNonNumberInput');
        selectPageSpy = vi.spyOn(component, 'selectPage');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should have input signal `collectionSize` to hold the default value', () => {
            expectToBe(isSignal(component.collectionSize), true);
            expectToBe(component.collectionSize(), 0);
        });

        it('... should have input signal `pageSize` to hold the default value', () => {
            expectToBe(isSignal(component.pageSize), true);
            expectToBe(component.pageSize(), TABLE_DEFAULT_PAGE_SIZE);
        });

        it('... should have model signal `page` to hold the default value', () => {
            expectToBe(isSignal(component.page), true);
            expectToBe(component.page(), 1);
        });

        it('... should have `FILTER_PAG_REGEX`', () => {
            expectToEqual(component.FILTER_PAG_REGEX, /\D/g);
        });

        describe('VIEW', () => {
            it('... should contain one NgbPagination component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
            });

            it('... should contain one ul in NgbPagination with no page items yet', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul', 1, 1);

                getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        const getPageInputEl = (): HTMLInputElement =>
            getAndExpectDebugElementByCss(compDe, 'input#paginationInput.custom-pages-input', 1, 1)[0].nativeElement;

        beforeEach(() => {
            // Set the initial values for the signal inputs
            fixture.componentRef.setInput('collectionSize', expectedCollectionSize);
            fixture.componentRef.setInput('page', expectedPage);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have input signal `collectionSize` to hold the provided collection size', () => {
            expectToBe(component.collectionSize(), expectedCollectionSize);
        });

        it('... should have model signal `page` to hold the provided page', () => {
            expectToBe(component.page(), expectedPage);
        });

        describe('VIEW', () => {
            it('... should pass down `page`, `collectionSize` and `pageSize` to NgbPagination', () => {
                const paginationDes = getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
                const paginationCmp = paginationDes[0].injector.get(NgbPagination);

                expectToBe(paginationCmp.page, expectedPage);
                expectToBe(paginationCmp.collectionSize, expectedCollectionSize);
                expectToBe(paginationCmp.pageSize, TABLE_DEFAULT_PAGE_SIZE);
                expectToBe(paginationCmp.boundaryLinks, true);
            });

            it('... should contain one ul.pagination with 4 li.page-item', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 4, 4);
            });

            it('... should disable the first two li.page-item on the first page', () => {
                const liDes = getAndExpectDebugElementByCss(compDe, 'ul.pagination > li.page-item', 4, 4);

                expectToContain(liDes[0].nativeElement.classList, 'disabled');
                expectToContain(liDes[1].nativeElement.classList, 'disabled');
                expectToNotContain(liDes[2].nativeElement.classList, 'disabled');
                expectToNotContain(liDes[3].nativeElement.classList, 'disabled');
            });

            it('... should contain a.page-link in all li.page-item', () => {
                const liDes = getAndExpectDebugElementByCss(compDe, 'ul.pagination > li.page-item', 4, 4);

                liDes.forEach(liDe => {
                    getAndExpectDebugElementByCss(liDe, 'a.page-link', 1, 1);
                });
            });

            it('... should not render custom pages item if pages are empty', async () => {
                fixture.componentRef.setInput('collectionSize', 0);
                await detectChangesOnPush(fixture);

                getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item', 0, 0);
                getAndExpectDebugElementByCss(compDe, 'input#paginationInput', 0, 0);
            });

            it('... should contain one li.ngb-custom-pages-item with label, input and span', () => {
                const divDes = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'label#paginationInputLabel', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'input#paginationInput.custom-pages-input', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'span#paginationDescription', 1, 1);
            });

            it('... should display `Seite` in label', () => {
                const labelDes = getAndExpectDebugElementByCss(compDe, 'label#paginationInputLabel', 1, 1);

                expectToBe(labelDes[0].nativeElement.textContent, 'Seite');
            });

            it('... should display the current page in input', () => {
                expectToBe(getPageInputEl().value, expectedPage.toString());
            });

            it('... should display the current page in input after page change', async () => {
                fixture.componentRef.setInput('page', 4);
                await detectChangesOnPush(fixture);

                expectToBe(getPageInputEl().value, '4');
            });

            it('... should display `von {pages.length}` in span', () => {
                const spanDes = getAndExpectDebugElementByCss(compDe, 'span#paginationDescription', 1, 1);

                expectToBe(
                    spanDes[0].nativeElement.textContent.trim(),
                    `von ${expectedCollectionSize / TABLE_DEFAULT_PAGE_SIZE}`
                );
            });

            describe('... with a provided page size', () => {
                beforeEach(async () => {
                    fixture.componentRef.setInput('pageSize', 25);
                    await detectChangesOnPush(fixture);
                });

                it('... should have input signal `pageSize` to hold the provided page size', () => {
                    expectToBe(component.pageSize(), 25);
                });

                it('... should pass down the provided `pageSize` to NgbPagination', () => {
                    const paginationDes = getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);

                    expectToBe(paginationDes[0].injector.get(NgbPagination).pageSize, 25);
                });

                it('... should display the number of pages for the provided page size in span', () => {
                    const spanDes = getAndExpectDebugElementByCss(compDe, 'span#paginationDescription', 1, 1);

                    expectToBe(spanDes[0].nativeElement.textContent.trim(), `von ${expectedCollectionSize / 25}`);
                });
            });

            it('... should trigger `replaceNonNumberInput()` on input event', () => {
                getPageInputEl().dispatchEvent(new Event('input'));

                expectSpyCall(replaceNonNumberInputSpy, 1);
            });

            it('... should trigger `selectPage()` on blur event', () => {
                const inputEl = getPageInputEl();
                inputEl.value = '5';
                inputEl.dispatchEvent(new Event('blur'));

                expectSpyCall(selectPageSpy, 1, '5');
            });

            it('... should trigger `selectPage()` on keyup.enter event', () => {
                const inputEl = getPageInputEl();
                inputEl.value = '5';
                inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

                expectSpyCall(selectPageSpy, 1, '5');
            });

            it('... should trigger `onPageChange()` on pageChange event of NgbPagination', async () => {
                const paginationDes = getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);

                // NgbPagination emits pageChange asynchronously
                paginationDes[0].injector.get(NgbPagination).pageChange.emit(3);
                await detectChangesOnPush(fixture);

                expectSpyCall(onPageChangeSpy, 1, 3);
            });

            describe('... output `pageChange`', () => {
                it('... should emit the selected page via model signal `page`', () => {
                    const emittedPages: number[] = [];
                    component.page.subscribe(page => emittedPages.push(page));

                    const inputEl = getPageInputEl();
                    inputEl.value = '5';
                    inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

                    expectToEqual(emittedPages, [5]);
                });
            });
        });

        describe('METHODS', () => {
            describe('#replaceNonNumberInput()', () => {
                it('... should have a method `replaceNonNumberInput`', () => {
                    expect(component.replaceNonNumberInput).toBeDefined();
                });

                it('... should keep numbers', () => {
                    const input = mockDocument.createElement('input');
                    input.value = '3';

                    component.replaceNonNumberInput(input);

                    expectToBe(input.value, '3');
                });

                it('... should replace non-numbers with empty string', () => {
                    const input = mockDocument.createElement('input');
                    input.value = 'T3st';

                    component.replaceNonNumberInput(input);

                    expectToBe(input.value, '3');
                });
            });

            describe('#onPageChange()', () => {
                it('... should have a method `onPageChange`', () => {
                    expect(component.onPageChange).toBeDefined();
                });

                it('... should set model signal `page` to the given page', () => {
                    component.onPageChange(3);

                    expectToBe(component.page(), 3);
                });

                it('... should do nothing if the given page is 0', () => {
                    component.onPageChange(0);

                    expectToBe(component.page(), expectedPage);
                });
            });

            describe('#selectPage()', () => {
                it('... should have a method `selectPage`', () => {
                    expect(component.selectPage).toBeDefined();
                });

                it('... should set model signal `page` to the parsed integer of a given number string', () => {
                    component.selectPage('3');

                    expectToBe(component.page(), 3);
                });

                it('... should set model signal `page` to 1 if the given value cannot be parsed', () => {
                    component.selectPage('3');

                    ['Test', 'NaN', '_123', ''].forEach(value => {
                        component.selectPage(value);

                        expectToBe(component.page(), 1);
                    });
                });
            });
        });
    });
});
