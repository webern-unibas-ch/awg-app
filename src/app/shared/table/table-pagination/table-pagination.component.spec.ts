import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement, NgModule } from '@angular/core';

import Spy = jasmine.Spy;
import { NgbConfig, NgbPaginationModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';

import {
    expectSpyCall,
    getAndExpectDebugElementByCss,
    getAndExpectDebugElementByDirective,
} from '@testing/expect-helper';

import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent (DONE)', () => {
    let component: TablePaginationComponent;
    let fixture: ComponentFixture<TablePaginationComponent>;
    let compDe: DebugElement;

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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not have collectionSize', () => {
            expect(component.collectionSize).toBeUndefined();
        });

        it('should not have page', () => {
            expect(component.page).toBeUndefined();
        });

        it('should have FILTER_PAG_REGEX', () => {
            expect(component.FILTER_PAG_REGEX).toBeDefined();

            expect(component.FILTER_PAG_REGEX).withContext(`should equal /\\D/g`).toEqual(/\D/g);
        });

        it('should not have called formatInput', () => {
            expectSpyCall(replaceNonNumberInputSpy, 0);
        });

        it('should not have called onPageChange', () => {
            expectSpyCall(onPageChangeSpy, 0);
        });

        it('should not have called selectPage', () => {
            expectSpyCall(selectPageSpy, 0);
        });

        describe('VIEW', () => {
            it('should have one ngbPagination component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
            });

            it('should have one ul in ngbPagination with no content yet', () => {
                const ulDe = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul', 1, 1);
                getAndExpectDebugElementByCss(ulDe[0], 'li.page-item', 0, 0);
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

        it('should have collectionSize', () => {
            expect(component.collectionSize).toBeDefined();
            expect(component.collectionSize)
                .withContext(`should equal ${expectedCollectionSize}`)
                .toEqual(expectedCollectionSize);
        });

        it('should have page', () => {
            expect(component.page).toBeDefined();
            expect(component.page).withContext(`should equal ${expectedPage}`).toEqual(expectedPage);
        });

        describe('VIEW', () => {
            it('should have one ngbPagination component', () => {
                getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
            });

            it('should have one ul.pagination in ngbPagination with 4 li.page-item', () => {
                const ulDe = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);
                getAndExpectDebugElementByCss(ulDe[0], 'li.page-item', 4, 4);
            });

            it('should have first two li.page-item with class .disabled', () => {
                const ulDe = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                const liDe = getAndExpectDebugElementByCss(ulDe[0], 'li.page-item', 4, 4);
                const liEl1 = liDe[0].nativeElement;
                const liEl2 = liDe[1].nativeElement;

                expect(liEl1.classList.contains('disabled')).toBeTruthy();
                expect(liEl1).toHaveClass('disabled');

                expect(liEl2.classList.contains('disabled')).toBeTruthy();
                expect(liEl2).toHaveClass('disabled');
            });

            it('should have last two li.page-item not with class .disabled', () => {
                const ulDe = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                const liDe = getAndExpectDebugElementByCss(ulDe[0], 'li.page-item', 4, 4);
                const liEl3 = liDe[2].nativeElement;
                const liEl4 = liDe[3].nativeElement;

                expect(liEl3.classList.contains('disabled')).toBeFalsy();
                expect(liEl3).not.toHaveClass('disabled');

                expect(liEl4.classList.contains('disabled')).toBeFalsy();
                expect(liEl4).not.toHaveClass('disabled');
            });

            it('should have a.page-link in all li.page-item', () => {
                const ulDe = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                const liDe = getAndExpectDebugElementByCss(ulDe[0], 'li.page-item', 4, 4);

                getAndExpectDebugElementByCss(liDe[0], 'a.page-link', 1, 1);
                getAndExpectDebugElementByCss(liDe[1], 'a.page-link', 1, 1);
                getAndExpectDebugElementByCss(liDe[2], 'a.page-link', 1, 1);
                getAndExpectDebugElementByCss(liDe[3], 'a.page-link', 1, 1);
            });

            it('should have one li.ngb-custom-pages-item in ul.pagination', () => {
                const ulDe = getAndExpectDebugElementByCss(compDe, 'ngb-pagination > ul.pagination', 1, 1);

                getAndExpectDebugElementByCss(ulDe[0], 'li.ngb-custom-pages-item', 1, 1);
            });

            it('should have one div with label, input and span in li.ngb-custom-page-item', () => {
                const liDe = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item', 1, 1);
                const divDe = getAndExpectDebugElementByCss(liDe[0], 'div', 1, 1);

                getAndExpectDebugElementByCss(divDe[0], 'label#paginationInputLabel', 1, 1);
                getAndExpectDebugElementByCss(divDe[0], 'input#paginationInput.custom-pages-input', 1, 1);
                getAndExpectDebugElementByCss(divDe[0], 'span#paginationDescription', 1, 1);
            });

            it('should display `Seite` in label', () => {
                const expectedLabel = 'Seite';

                const divDe = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);

                const labelDe = getAndExpectDebugElementByCss(divDe[0], 'label#paginationInputLabel', 1, 1);
                const labelEl = labelDe[0].nativeElement;

                expect(labelEl.textContent).toBeTruthy();
                expect(labelEl.textContent).withContext(`should be ${expectedLabel}`).toBe(expectedLabel);
            });

            it('should display recent page in input', () => {
                const expectedInputValue = expectedPage.toString();

                const divDe = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);
                const inputDe = getAndExpectDebugElementByCss(
                    divDe[0],
                    'input#paginationInput.custom-pages-input',
                    1,
                    1
                );
                const inputEl = inputDe[0].nativeElement;

                expect(inputEl.value).toBeTruthy();
                expect(inputEl.value).withContext(`should be ${expectedInputValue}`).toBe(expectedInputValue);
            });

            it('should display `von pages.length` in span', () => {
                const expectedPagesLength = expectedCollectionSize / 10;
                const expectedSpanText = `von ${expectedPagesLength}`;

                const divDe = getAndExpectDebugElementByCss(compDe, 'li.ngb-custom-pages-item > div', 1, 1);

                const spanDe = getAndExpectDebugElementByCss(divDe[0], 'span#paginationDescription', 1, 1);
                const spanEl = spanDe[0].nativeElement;

                expect(spanEl.textContent).toBeTruthy();
                expect(spanEl.textContent.trim()).withContext(`should be ${expectedSpanText}`).toBe(expectedSpanText);
            });
        });

        describe('#replaceNonNumberInput()', () => {
            it('should have a replaceNonNumberInput method', () => {
                expect(component.replaceNonNumberInput).toBeDefined();
            });

            it('should trigger on input event', () => {
                const inputDe = getAndExpectDebugElementByCss(compDe, 'input#paginationInput.custom-pages-input', 1, 1);
                const inputEl = inputDe[0].nativeElement;

                expectSpyCall(replaceNonNumberInputSpy, 0);

                inputEl.dispatchEvent(new Event('input'));

                expectSpyCall(replaceNonNumberInputSpy, 1);
            });

            describe('should format the HTMLInputElement input', () => {
                it('... by keeping numbers', () => {
                    const input = document.createElement('input');
                    input.value = '3';

                    component.replaceNonNumberInput(input);
                    expect(input.value).toBe('3');
                });

                it('... by replacing non-numbers with empty string', () => {
                    const input = document.createElement('input');
                    input.value = 'Test';

                    component.replaceNonNumberInput(input);
                    expect(input.value).toBe('');
                });
            });
        });

        describe('#onPageChange()', () => {
            it('should have a onPageChange method', () => {
                expect(component.onPageChange).toBeDefined();
            });

            it('should trigger on pageChange event of NgbPagination', fakeAsync(() => {
                const expectedNewPage = 3;

                const ngbPaginationDe = getAndExpectDebugElementByDirective(compDe, NgbPagination, 1, 1);
                const ngbPaginationCmp = ngbPaginationDe[0].injector.get(NgbPagination) as NgbPagination;

                expectSpyCall(onPageChangeSpy, 0);

                ngbPaginationCmp.pageChange.emit(expectedNewPage);
                tick(); // Wait for value to be emitted

                expectSpyCall(onPageChangeSpy, 1, expectedNewPage);
            }));

            it('should not do anything if newPage is not given', () => {
                component.onPageChange(undefined);

                expectSpyCall(emitPageChangeSpy, 0);
                expectSpyCall(emitPageChangeRequestSpy, 0);
            });

            it('should emit the newPage', () => {
                const expectedNewPage = 3;

                component.onPageChange(expectedNewPage);

                expectSpyCall(emitPageChangeSpy, 1, expectedNewPage);
                expectSpyCall(emitPageChangeRequestSpy, 1, expectedNewPage);
            });
        });

        describe('#selectPage()', () => {
            it('should have a selectChange method', () => {
                expect(component.selectPage).toBeDefined();
            });

            it('should trigger on blur event', () => {
                const inputDe = getAndExpectDebugElementByCss(compDe, 'input#paginationInput.custom-pages-input', 1, 1);
                const inputEl = inputDe[0].nativeElement;

                expectSpyCall(selectPageSpy, 0);

                inputEl.value = '5';
                inputEl.dispatchEvent(new Event('blur'));

                expectSpyCall(selectPageSpy, 1, '5');
            });

            it('should trigger on keyup.enter event', () => {
                const inputDe = getAndExpectDebugElementByCss(compDe, 'input#paginationInput.custom-pages-input', 1, 1);
                const inputEl = inputDe[0].nativeElement;

                expectSpyCall(selectPageSpy, 0);

                inputEl.value = '5';
                inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

                expectSpyCall(selectPageSpy, 1, '5');
            });

            describe('should set the page', () => {
                it('... to the parsed integer value of a given number string', () => {
                    const expectedNewPage = 3;

                    component.selectPage(expectedNewPage.toString());

                    expect(component.page).toBeTruthy();
                    expect(component.page).withContext(`should be ${expectedNewPage}`).toBe(expectedNewPage);
                });

                it('... to 1 if the given value cannot be parsed to an integer', () => {
                    const expectedNewPage = 'Test';

                    component.selectPage(expectedNewPage);

                    expect(component.page).toBeTruthy();
                    expect(component.page).withContext(`should be 1`).toBe(1);

                    const expectedNewPage2 = 'NaN';

                    component.selectPage(expectedNewPage2);

                    expect(component.page).toBeTruthy();
                    expect(component.page).withContext(`should be 1`).toBe(1);

                    const expectedNewPage3 = '_123';

                    component.selectPage(expectedNewPage3);

                    expect(component.page).toBeTruthy();
                    expect(component.page).withContext(`should be 1`).toBe(1);
                });

                it('... to 1 if the given value is undefined', () => {
                    component.selectPage(undefined);

                    expect(component.page).toBeTruthy();
                    expect(component.page).withContext(`should be 1`).toBe(1);
                });
            });
        });
    });
});
