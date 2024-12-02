import { DOCUMENT } from '@angular/common';
import { DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { NgbConfig, NgbPagination, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import {
    expectSpyCall,
    expectToBe,
    expectToEqual,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent (DONE)', () => {
    let component: TablePaginationComponent;
    let fixture: ComponentFixture<TablePaginationComponent>;
    let compDe: DebugElement;

    let mockDocument: Document;

    let emitPageChangeSpy: Spy;
    let emitPageChangeRequestSpy: Spy;
    let onPageChangeSpy: Spy;
    let replaceNonNumberInputSpy: Spy;
    let selectPageSpy: Spy;

    let expectedCollectionSize: number;
    let expectedPage: number;

    // global NgbConfigModule
    @NgModule({ imports: [NgbPaginationModule], exports: [NgbPaginationModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbConfigModule],
            declarations: [TablePaginationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TablePaginationComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        mockDocument = TestBed.inject(DOCUMENT);

        // Test data
        expectedCollectionSize = 100;
        expectedPage = 1;

        // Spy on methods
        emitPageChangeSpy = spyOn(component.pageChange, 'emit').and.callThrough();
        emitPageChangeRequestSpy = spyOn(component.pageChangeRequest, 'emit').and.callThrough();
        onPageChangeSpy = spyOn(component, 'onPageChange').and.callThrough();
        replaceNonNumberInputSpy = spyOn(component, 'replaceNonNumberInput').and.callThrough();
        selectPageSpy = spyOn(component, 'selectPage').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have collectionSize', () => {
            expect(component.collectionSize).toBeUndefined();
        });

        it('... should not have page', () => {
            expect(component.page).toBeUndefined();
        });

        it('... should have FILTER_PAG_REGEX', () => {
            expectToEqual(component.FILTER_PAG_REGEX, /\D/g);
        });

        it('... should not have called formatInput', () => {
            expectSpyCall(replaceNonNumberInputSpy, 0);
        });

        it('... should not have called onPageChange', () => {
            expectSpyCall(onPageChangeSpy, 0);
        });

        it('... should not have called selectPage', () => {
            expectSpyCall(selectPageSpy, 0);
        });

        describe('VIEW', () => {
            it('... should have one ngbPagination component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
            });

            it('... should have one ul in ngbPagination with no content yet', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul', 1, 1);
                getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 0, 0);
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent setting the input properties
            component.collectionSize = expectedCollectionSize;
            component.page = expectedPage;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should have collectionSize', () => {
            expectToBe(component.collectionSize, expectedCollectionSize);
        });

        it('... should have page', () => {
            expectToBe(component.page, expectedPage);
        });

        describe('VIEW', () => {
            it('... should have one ngbPagination component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
            });

            it('... should have one ul.pagination in ngbPagination with 4 li.page-item', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);
                getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 4, 4);
            });

            it('... should have first two li.page-item with class .disabled', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                const liDes = getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 4, 4);
                const liEl1: HTMLLIElement = liDes[0].nativeElement;
                const liEl2: HTMLLIElement = liDes[1].nativeElement;

                expect(liEl1.classList.contains('disabled')).toBeTruthy();
                expect(liEl1).toHaveClass('disabled');

                expect(liEl2.classList.contains('disabled')).toBeTruthy();
                expect(liEl2).toHaveClass('disabled');
            });

            it('... should have last two li.page-item not with class .disabled', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                const liDes = getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 4, 4);
                const liEl3: HTMLLIElement = liDes[2].nativeElement;
                const liEl4: HTMLLIElement = liDes[3].nativeElement;

                expect(liEl3.classList.contains('disabled')).toBeFalsy();
                expect(liEl3).not.toHaveClass('disabled');

                expect(liEl4.classList.contains('disabled')).toBeFalsy();
                expect(liEl4).not.toHaveClass('disabled');
            });

            it('... should have a.page-link in all li.page-item', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                const liDes = getAndExpectDebugElementByCss(ulDes[0], 'li.page-item', 4, 4);

                getAndExpectDebugElementByCss(liDes[0], 'a.page-link', 1, 1);
                getAndExpectDebugElementByCss(liDes[1], 'a.page-link', 1, 1);
                getAndExpectDebugElementByCss(liDes[2], 'a.page-link', 1, 1);
                getAndExpectDebugElementByCss(liDes[3], 'a.page-link', 1, 1);
            });

            it('... should have one li.ngb-custom-pages-item in ul.pagination', () => {
                const ulDes = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                getAndExpectDebugElementByCss(ulDes[0], 'li.ngb-custom-pages-item', 1, 1);
            });

            it('... should have one div with label, input and span in li.ngb-custom-page-item', () => {
                const liDes = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item', 1, 1);
                const divDes = getAndExpectDebugElementByCss(liDes[0], 'div', 1, 1);

                getAndExpectDebugElementByCss(divDes[0], 'label#paginationInputLabel', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'input#paginationInput.custom-pages-input', 1, 1);
                getAndExpectDebugElementByCss(divDes[0], 'span#paginationDescription', 1, 1);
            });

            it('... should display `Seite` in label', () => {
                const expectedLabel = 'Seite';

                const divDes = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);

                const labelDes = getAndExpectDebugElementByCss(divDes[0], 'label#paginationInputLabel', 1, 1);
                const labelEl: HTMLLabelElement = labelDes[0].nativeElement;

                expectToBe(labelEl.textContent, expectedLabel);
            });

            it('... should display recent page in input', () => {
                const expectedInputValue = expectedPage.toString();

                const divDes = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);
                const inputDes = getAndExpectDebugElementByCss(
                    divDes[0],
                    'input#paginationInput.custom-pages-input',
                    1,
                    1
                );
                const inputEl: HTMLInputElement = inputDes[0].nativeElement;

                expectToBe(inputEl.value, expectedInputValue);
            });

            it('... should display `von pages.length` in span', () => {
                const expectedPagesLength = expectedCollectionSize / 10;
                const expectedSpanText = `von ${expectedPagesLength}`;

                const divDes = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);

                const spanDes = getAndExpectDebugElementByCss(divDes[0], 'span#paginationDescription', 1, 1);
                const spanEl: HTMLSpanElement = spanDes[0].nativeElement;

                expectToBe(spanEl.textContent.trim(), expectedSpanText);
            });
        });

        describe('#replaceNonNumberInput()', () => {
            it('... should have a method `replaceNonNumberInput`', () => {
                expect(component.replaceNonNumberInput).toBeDefined();
            });

            it('... should trigger on input event', () => {
                const inputDes = getAndExpectDebugElementByCss(
                    compDe,
                    'input#paginationInput.custom-pages-input',
                    1,
                    1
                );
                const inputEl: HTMLInputElement = inputDes[0].nativeElement;

                expectSpyCall(replaceNonNumberInputSpy, 0);

                inputEl.dispatchEvent(new Event('input'));

                expectSpyCall(replaceNonNumberInputSpy, 1);
            });

            describe('should format the HTMLInputElement input', () => {
                it('... by keeping numbers', () => {
                    const input = mockDocument.createElement('input');
                    input.value = '3';

                    component.replaceNonNumberInput(input);
                    expectToBe(input.value, '3');
                });

                it('... by replacing non-numbers with empty string', () => {
                    const input = mockDocument.createElement('input');
                    input.value = 'Test';

                    component.replaceNonNumberInput(input);
                    expectToBe(input.value, '');
                });
            });
        });

        describe('#onPageChange()', () => {
            it('... should have a method `onPageChange`', () => {
                expect(component.onPageChange).toBeDefined();
            });

            it('... should trigger on pageChange event of NgbPagination', fakeAsync(() => {
                const expectedNewPage = 3;

                const ngbPaginationDes = getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
                const ngbPaginationCmp = ngbPaginationDes[0].injector.get(NgbPagination) as NgbPagination;

                expectSpyCall(onPageChangeSpy, 0);

                ngbPaginationCmp.pageChange.emit(expectedNewPage);
                tick(); // Wait for value to be emitted

                expectSpyCall(onPageChangeSpy, 1, expectedNewPage);
            }));

            it('... should not do anything if newPage is not given', () => {
                component.onPageChange(undefined);

                expectSpyCall(emitPageChangeSpy, 0);
                expectSpyCall(emitPageChangeRequestSpy, 0);
            });

            it('... should emit the newPage', () => {
                const expectedNewPage = 3;

                component.onPageChange(expectedNewPage);

                expectSpyCall(emitPageChangeSpy, 1, expectedNewPage);
                expectSpyCall(emitPageChangeRequestSpy, 1, expectedNewPage);
            });
        });

        describe('#selectPage()', () => {
            it('... should have a method `selectPage`', () => {
                expect(component.selectPage).toBeDefined();
            });

            it('... should trigger on blur event', () => {
                const inputDes = getAndExpectDebugElementByCss(
                    compDe,
                    'input#paginationInput.custom-pages-input',
                    1,
                    1
                );
                const inputEl: HTMLInputElement = inputDes[0].nativeElement;

                expectSpyCall(selectPageSpy, 0);

                inputEl.value = '5';
                inputEl.dispatchEvent(new Event('blur'));

                expectSpyCall(selectPageSpy, 1, '5');
            });

            it('... should trigger on keyup.enter event', () => {
                const inputDes = getAndExpectDebugElementByCss(
                    compDe,
                    'input#paginationInput.custom-pages-input',
                    1,
                    1
                );
                const inputEl: HTMLInputElement = inputDes[0].nativeElement;

                expectSpyCall(selectPageSpy, 0);

                inputEl.value = '5';
                inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

                expectSpyCall(selectPageSpy, 1, '5');
            });

            describe('should set the page', () => {
                it('... to the parsed integer value of a given number string', () => {
                    const expectedNewPage = 3;

                    component.selectPage(expectedNewPage.toString());

                    expectToBe(component.page, expectedNewPage);
                });

                it('... to 1 if the given value cannot be parsed to an integer', () => {
                    const expectedNewPage = 'Test';

                    component.selectPage(expectedNewPage);

                    expectToBe(component.page, 1);

                    const expectedNewPage2 = 'NaN';

                    component.selectPage(expectedNewPage2);

                    expectToBe(component.page, 1);

                    const expectedNewPage3 = '_123';

                    component.selectPage(expectedNewPage3);

                    expectToBe(component.page, 1);
                });

                it('... to 1 if the given value is undefined', () => {
                    component.selectPage(undefined);

                    expectToBe(component.page, 1);
                });
            });
        });
    });
});
