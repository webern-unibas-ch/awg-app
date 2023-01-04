import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeTestingModule } from '@fortawesome/angular-fontawesome/testing';
import { faSearch, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import Spy = jasmine.Spy;

import { expectSpyCall, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { FulltextSearchFormComponent } from './fulltext-search-form.component';

describe('FulltextSearchFormComponent (DONE)', () => {
    let component: FulltextSearchFormComponent;
    let fixture: ComponentFixture<FulltextSearchFormComponent>;
    let compDe: DebugElement;

    // Create new instance of FormBuilder
    const formBuilder: FormBuilder = new FormBuilder();

    let expectedSearchValue: string;
    let expectedSearchFormStrings: {
        label: string;
        placeholder: string;
        errorMessage: string;
    };
    let expectedSearchIcon: IconDefinition;

    let createFulltextSearchFormGroupSpy: Spy;
    let listenToUserInputChangeSpy: Spy;
    let setSearchvalFromInputSpy: Spy;
    let onSearchSpy: Spy;
    let searchRequestSpy: Spy;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [FontAwesomeTestingModule, ReactiveFormsModule],
            declarations: [FulltextSearchFormComponent],
            providers: [
                // Reference the new instance of formBuilder from above
                { provide: FormBuilder, useValue: formBuilder },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FulltextSearchFormComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedSearchValue = 'Test';
        expectedSearchFormStrings = {
            label: 'Input für Volltextsuche',
            placeholder: 'Volltextsuche in der Webern-Datenbank …',
            errorMessage: 'Es wird ein Suchbegriff mit mindestens 3 Zeichen benötigt!',
        };
        expectedSearchIcon = faSearch;

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        createFulltextSearchFormGroupSpy = spyOn(component, 'createFulltextSearchFormGroup').and.callThrough();
        listenToUserInputChangeSpy = spyOn(component, 'listenToUserInputChange').and.callThrough();
        setSearchvalFromInputSpy = spyOn(component, 'setSearchvalFromInput').and.callThrough();
        onSearchSpy = spyOn(component, 'onSearch').and.callThrough();
        searchRequestSpy = spyOn(component.searchRequest, 'emit').and.callThrough();
    });

    it('... should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('... should not have `searchValue` input', () => {
            expect(component.searchValue).toBeUndefined();
        });

        it('... should not have `searchForm`', () => {
            expect(component.searchForm).toBeUndefined();
        });

        it('... should have `faSearch` icon', () => {
            expect(component.faSearch).toBeTruthy();
            expect(component.faSearch).withContext(`should equal ${expectedSearchIcon}`).toBe(expectedSearchIcon);
        });

        it('... should have `searchFormStrings`', () => {
            expect(component.searchFormStrings).toBeTruthy();
            expect(component.searchFormStrings)
                .withContext(`should equal ${expectedSearchFormStrings}`)
                .toEqual(expectedSearchFormStrings);
        });

        describe('VIEW', () => {
            it('... should have one form with one div.input-group', () => {
                const formDe = getAndExpectDebugElementByCss(compDe, 'form', 1, 1);
                getAndExpectDebugElementByCss(formDe[0], 'div.input-group', 1, 1);
            });

            it('... should have one div.input-group-text and one div.awg-form-floating-group in div.input-group', () => {
                const inputGroupDe = getAndExpectDebugElementByCss(compDe, 'div.input-group', 1, 1);

                getAndExpectDebugElementByCss(inputGroupDe[0], 'div.input-group-text', 1, 1);
                getAndExpectDebugElementByCss(inputGroupDe[0], 'div.awg-form-floating-group', 1, 1);
            });

            it('... should have one fa-icon in div.input-group-text', () => {
                const inputGroupTextDe = getAndExpectDebugElementByCss(compDe, 'div.input-group-text', 1, 1);
                getAndExpectDebugElementByCss(inputGroupTextDe[0], 'fa-icon', 1, 1);
            });

            it('... should have one input.form-control#awg-fulltext-search-searchValue in div.awg-form-floating-group', () => {
                const formFloatingGroupDe = getAndExpectDebugElementByCss(compDe, 'div.awg-form-floating-group', 1, 1);
                getAndExpectDebugElementByCss(
                    formFloatingGroupDe[0],
                    'input.form-control#awg-fulltext-search-searchValue',
                    1,
                    1
                );
            });

            it('... should have no value or placeholder in input.form-control yet', () => {
                const inputDe = getAndExpectDebugElementByCss(
                    compDe,
                    'input.form-control#awg-fulltext-search-searchValue',
                    1,
                    1
                );
                const inputEl = inputDe[0].nativeElement;

                expect(inputEl.value).toBeFalsy();
                expect(inputEl.placeholder).toBeFalsy();
            });

            it('... should have no title for input.form-control yet', () => {
                const inputDe = getAndExpectDebugElementByCss(compDe, 'input.form-control', 1, 1);
                const inputEl = inputDe[0].nativeElement;

                expect(inputEl.title).toBeFalsy();
            });

            it('... should have one label.text-muted in div.awg-form-floating-group', () => {
                const formFloatingGroupDe = getAndExpectDebugElementByCss(compDe, 'div.awg-form-floating-group', 1, 1);
                getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'label.text-muted', 1, 1);
            });

            it('... should have no placeholder in label.text-muted yet', () => {
                const formFloatingGroupDe = getAndExpectDebugElementByCss(compDe, 'div.awg-form-floating-group', 1, 1);
                const labelDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'label.text-muted', 1, 1);
                const labelEl = labelDe[0].nativeElement;

                expect(labelEl.textContent).toBeFalsy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Simulate the parent component setting the data
            component.searchValue = expectedSearchValue;

            // Trigger initial data binding
            fixture.detectChanges();
        });

        it('... should trigger the `createFulltextSearchFormGroup()` method', () => {
            expectSpyCall(createFulltextSearchFormGroupSpy, 1, undefined);
        });

        it('... should trigger the `listenToUserInputChange()` method', () => {
            expectSpyCall(listenToUserInputChangeSpy, 1, undefined);
        });

        it('... should have `searchValue` input', () => {
            expect(component.searchValue).toBeTruthy();
            expect(component.searchValue).withContext(`should be ${expectedSearchValue}`).toBe(expectedSearchValue);
        });

        it('... should have `searchForm`', () => {
            expect(component.searchForm).toBeTruthy();
            expect(component.searchForm).toBeInstanceOf(FormGroup);
        });

        describe('VIEW', () => {
            it('... should display faSearch icon in div.input-group-text', () => {
                const inputGroupTextDe = getAndExpectDebugElementByCss(compDe, 'div.input-group-text', 1, 1);
                const faIconDe = getAndExpectDebugElementByCss(inputGroupTextDe[0], 'fa-icon', 1, 1);
                const faIconIns = faIconDe[0].componentInstance.icon;

                expect(faIconIns).toBeTruthy();
                expect(faIconIns).withContext(`should equal ${expectedSearchIcon}`).toEqual(expectedSearchIcon);
            });

            it('... should have a title for input.form-control', () => {
                const formFloatingGroupDe = getAndExpectDebugElementByCss(compDe, 'div.awg-form-floating-group', 1, 1);
                const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                const inputEl = inputDe[0].nativeElement;

                expect(inputEl.title).toBeTruthy();
                expect(inputEl.title)
                    .withContext(`should be ${expectedSearchFormStrings.label}`)
                    .toBe(expectedSearchFormStrings.label);
            });

            it('... should have a placeholder in label.text-muted', () => {
                const formFloatingGroupDe = getAndExpectDebugElementByCss(compDe, 'div.awg-form-floating-group', 1, 1);
                const labelDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'label.text-muted', 1, 1);
                const labelEl = labelDe[0].nativeElement;

                expect(labelEl.textContent).toBeTruthy();
                expect(labelEl.textContent)
                    .withContext(`should be ${expectedSearchFormStrings.placeholder}`)
                    .toBe(expectedSearchFormStrings.placeholder);
            });

            describe('... form untouched (pristine && invalid)', () => {
                it('... should have no value, but display a placeholder in input.form-control', () => {
                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    expect(inputEl.value).toBeFalsy();
                    expect(inputEl.placeholder).toBeTruthy();
                    expect(inputEl.placeholder)
                        .withContext(`should be ${expectedSearchFormStrings.placeholder}`)
                        .toBe(expectedSearchFormStrings.placeholder);
                });

                it('... should have class `is-invalid` in input.form-control', () => {
                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    expect(inputEl.classList).toContain('is-invalid');
                });

                it('... should have class `ng-pristine`, but not `ng-dirty` in input.form-control', () => {
                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    expect(inputEl.classList).toContain('ng-pristine');
                    expect(inputEl.classList).not.toContain('ng-dirty');
                });

                it('... should have an invalid searchval input', () => {
                    expect(component.searchvalControl.valid).toBeFalse();
                });

                it('... should have an invalid form', () => {
                    expect(component.searchForm.valid).toBeFalse();
                });

                it('... should not have a div.invalid-feedback', () => {
                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'div.invalid-feedback', 0, 0);
                });
            });

            describe('... form touched (dirty), but invalid', () => {
                it('... should have value from input and still display a placeholder in input.form-control', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    expect(inputEl.value).toBeTruthy();
                    expect(inputEl.value).withContext(`should be ${expectedSearchValue}`).toBe(expectedSearchValue);

                    expect(inputEl.placeholder).toBeTruthy();
                    expect(inputEl.placeholder)
                        .withContext(`should be ${expectedSearchFormStrings.placeholder}`)
                        .toBe(expectedSearchFormStrings.placeholder);
                });

                it('... should have class `is-invalid` in input.form-control', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    inputEl.dispatchEvent(new Event('input'));
                    fixture.detectChanges();

                    expect(inputEl.classList).toContain('is-invalid');
                });

                it('... should not have class `ng-pristine`, but `ng-dirty` in input.form-control', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    inputEl.dispatchEvent(new Event('input'));
                    fixture.detectChanges();

                    expect(inputEl.classList).not.toContain('ng-pristine');
                    expect(inputEl.classList).toContain('ng-dirty');
                });

                it('... should have an invalid searchval input', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    expect(component.searchvalControl.valid).toBeFalse();
                });

                it('... should have an invalid form', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    expect(component.searchForm.valid).toBeFalse();
                });

                it('... should have a div.invalid-feedback if form is invalid after input', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    inputEl.dispatchEvent(new Event('input'));
                    fixture.detectChanges();

                    getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'div.invalid-feedback', 1, 1);
                });

                it('... should have an error message in div.invalid-feedback if form is invalid', () => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    inputEl.dispatchEvent(new Event('input'));
                    fixture.detectChanges();

                    const invalidFeedbackDe = getAndExpectDebugElementByCss(
                        formFloatingGroupDe[0],
                        'div.invalid-feedback',
                        1,
                        1
                    );
                    const invalidFeedbackEl = invalidFeedbackDe[0].nativeElement;

                    expect(invalidFeedbackEl.textContent).toBeTruthy();
                    expect(invalidFeedbackEl.textContent.trim())
                        .withContext(`should be ${expectedSearchFormStrings.errorMessage}`)
                        .toBe(expectedSearchFormStrings.errorMessage.trim());
                });
            });

            describe('... form touched (dirty) and valid', () => {
                it('... should have value from input and still display a placeholder in input.form-control', () => {
                    expectedSearchValue = 'abc';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    expect(inputEl.value).toBeTruthy();
                    expect(inputEl.value).withContext(`should be ${expectedSearchValue}`).toBe(expectedSearchValue);

                    expect(inputEl.placeholder).toBeTruthy();
                    expect(inputEl.placeholder)
                        .withContext(`should be ${expectedSearchFormStrings.placeholder}`)
                        .toBe(expectedSearchFormStrings.placeholder);
                });

                it('... should not have class `is-invalid` in input.form-control', () => {
                    expectedSearchValue = 'abc';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    inputEl.dispatchEvent(new Event('input'));
                    fixture.detectChanges();

                    expect(inputEl.classList).not.toContain('is-invalid');
                });

                it('... should not have class `ng-pristine`, but `ng-dirty` in input.form-control', fakeAsync(() => {
                    expectedSearchValue = 'ab';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );
                    const inputDe = getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'input.form-control', 1, 1);
                    const inputEl = inputDe[0].nativeElement;

                    inputEl.dispatchEvent(new Event('input'));
                    fixture.detectChanges();

                    expect(inputEl.classList).not.toContain('ng-pristine');
                    expect(inputEl.classList).toContain('ng-dirty');
                }));

                it('... should have a valid searchval input', () => {
                    expectedSearchValue = 'abc';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    expect(component.searchvalControl.valid).toBeTruthy();
                });

                it('... should have a valid form', () => {
                    expectedSearchValue = 'abc';
                    component.searchValue = expectedSearchValue;
                    component.setSearchvalFromInput();
                    fixture.detectChanges();

                    expect(component.searchForm.valid).toBeTrue();
                });

                it('... should not have a div.invalid-feedback', () => {
                    const formFloatingGroupDe = getAndExpectDebugElementByCss(
                        compDe,
                        'div.awg-form-floating-group',
                        1,
                        1
                    );

                    getAndExpectDebugElementByCss(formFloatingGroupDe[0], 'div.invalid-feedback', 0, 0);
                });
            });
        });

        describe('#createFulltextSearchFormGroup()', () => {
            it('... should have a `createFulltextSearchFormGroup()` method', () => {
                expect(component.createFulltextSearchFormGroup).toBeDefined();
            });

            it('... should trigger on init', () => {
                expectSpyCall(createFulltextSearchFormGroupSpy, 1, undefined);
            });

            it('... should create the searchForm', () => {
                expect(component.searchForm).toBeDefined();
                expect(component.searchForm).toBeInstanceOf(FormGroup);
                expect(component.searchForm.controls).toBeDefined();
            });

            it('... should create the searchForm with correct searchvalControl', () => {
                expect(component.searchForm.controls).toBeDefined();

                expect(component.searchForm.controls['searchvalControl']).toBeDefined();
                expect(component.searchForm.controls['searchvalControl']).toBeInstanceOf(FormControl);
            });

            it('... should create the searchForm with empty searchvalControl value', () => {
                expect(component.searchForm.controls['searchvalControl'].value).toBeFalsy();
            });

            it('... should get the searchvalControl from its getter', () => {
                expect(component.searchvalControl).toBeDefined();
                expect(component.searchvalControl).toBeInstanceOf(FormControl);

                expect(component.searchvalControl.value).toBeFalsy();
            });
        });

        describe('#isFulltextSearchInputInvalid()', () => {
            it('... should have a `isFulltextSearchInputInvalid()` method', () => {
                expect(component.isFulltextSearchInputInvalid).toBeDefined();
            });

            describe('should return true (INVALID) if...', () => {
                it('... searchvalControl value is empty', () => {
                    component.searchvalControl.setValue('');
                    fixture.detectChanges();

                    expect(component.isFulltextSearchInputInvalid()).toBeTrue();
                });

                it('... searchvalControl value is whitespace', () => {
                    component.searchvalControl.setValue(' ');
                    fixture.detectChanges();

                    expect(component.isFulltextSearchInputInvalid()).toBeTrue();
                });

                it('... searchvalControl value has less than 3 characters', () => {
                    component.searchvalControl.setValue('a');
                    fixture.detectChanges();

                    expect(component.isFulltextSearchInputInvalid()).toBeTrue();

                    component.searchvalControl.setValue('ab');
                    fixture.detectChanges();

                    expect(component.isFulltextSearchInputInvalid()).toBeTrue();
                });
            });

            describe('should return false (VALID) if...', () => {
                it('... searchvalControl value has 3 or more characters', () => {
                    component.searchvalControl.setValue('abc');
                    fixture.detectChanges();

                    expect(component.isFulltextSearchInputInvalid()).toBeFalsy();

                    component.searchvalControl.setValue('abcd');
                    fixture.detectChanges();

                    expect(component.isFulltextSearchInputInvalid()).toBeFalsy();
                });
            });
        });

        describe('#listenToUserInputChange()', () => {
            it('... should have a `listenToUserInputChange()` method', () => {
                expect(component.listenToUserInputChange).toBeDefined();
            });

            it('... should trigger the `onSearch()` method when searchval control changes value', fakeAsync(() => {
                // Trigger the value change
                component.searchvalControl.setValue(expectedSearchValue);
                fixture.detectChanges();

                // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                tick(500);

                expectSpyCall(onSearchSpy, 1, expectedSearchValue);
            }));

            describe('... should not trigger the `onSearch()` methodn when ...', () => {
                it('... input is invalid', fakeAsync(() => {
                    // Trigger the value change
                    component.searchvalControl.setValue('a');
                    fixture.detectChanges();

                    // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                    tick(500);

                    expectSpyCall(onSearchSpy, 0, undefined);
                }));

                it('... debounce time is smaller than 500 ms', fakeAsync(() => {
                    // Trigger the value change
                    component.searchvalControl.setValue(expectedSearchValue);
                    fixture.detectChanges();

                    // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                    tick(499);

                    discardPeriodicTasks();

                    expectSpyCall(onSearchSpy, 0, undefined);
                }));

                it('... new search value is the same as the old one', fakeAsync(() => {
                    // Trigger the value change
                    component.searchvalControl.setValue(expectedSearchValue);
                    fixture.detectChanges();

                    // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                    tick(500);

                    expectSpyCall(onSearchSpy, 1, expectedSearchValue);

                    // Trigger the value change
                    component.searchvalControl.setValue(expectedSearchValue);
                    fixture.detectChanges();

                    // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                    tick(500);

                    expectSpyCall(onSearchSpy, 1, expectedSearchValue);
                }));

                it('... component is destroyed', fakeAsync(() => {
                    // Trigger the value change
                    component.searchvalControl.setValue('Test before destroy');
                    fixture.detectChanges();

                    // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                    tick(500);

                    expectSpyCall(onSearchSpy, 1, 'Test before destroy');

                    // Destroy the component
                    fixture.destroy();

                    // Trigger the value change
                    component.searchvalControl.setValue('Test after destroy');
                    fixture.detectChanges();

                    // Wait for debounce time of 500 ms to pass (needs `fakeAsync` mode)
                    tick(500);

                    expectSpyCall(onSearchSpy, 1, 'Test before destroy');
                }));
            });
        });

        describe('#setSearchvalFromInput()', () => {
            it('... should have a `setSearchvalFromInput()` method', () => {
                expect(component.setSearchvalFromInput).toBeDefined();
            });

            it('... should set the searchvalControl value to the current search value', () => {
                component.setSearchvalFromInput();
                fixture.detectChanges();

                expect(component.searchvalControl.value)
                    .withContext(`should be ${expectedSearchValue}`)
                    .toBe(expectedSearchValue);
            });

            it('... should change the searchvalControl value if the current search value changes', () => {
                const otherSearchValue = 'Another Test';
                component.searchValue = otherSearchValue;
                component.setSearchvalFromInput();
                fixture.detectChanges();

                expect(component.searchvalControl.value)
                    .withContext(`should be ${otherSearchValue}`)
                    .toBe(otherSearchValue);
            });

            it('... should trigger on changes of searchValue', () => {
                const setSearchValControlValueSpy = spyOn(component.searchvalControl, 'setValue').and.callThrough();

                // Directly trigger ngOnChanges
                const otherSearchValue = 'Another test';
                component.searchValue = otherSearchValue;
                component.ngOnChanges({
                    searchValue: new SimpleChange(expectedSearchValue, otherSearchValue, false),
                });

                expectSpyCall(setSearchvalFromInputSpy, 1, undefined);
                expectSpyCall(setSearchValControlValueSpy, 1, otherSearchValue);
            });

            it('... should not trigger on changes of searchValue if first change', () => {
                const setSearchValControlValueSpy = spyOn(component.searchvalControl, 'setValue').and.callThrough();

                // Directly trigger ngOnChanges
                const otherSearchValue = 'Another test';
                component.searchValue = otherSearchValue;
                component.ngOnChanges({
                    searchValue: new SimpleChange(expectedSearchValue, otherSearchValue, true),
                });

                expectSpyCall(setSearchvalFromInputSpy, 0);
                expectSpyCall(setSearchvalFromInputSpy, 0);
            });
        });

        describe('#onSearch()', () => {
            it('... should have a `onSearch()` method', () => {
                expect(component.onSearch).toBeDefined();
            });

            describe('... should not do anything if ', () => {
                it('... query is undefined', () => {
                    let expectedQuery: undefined;

                    component.onSearch(expectedQuery);
                    fixture.detectChanges();

                    expectSpyCall(searchRequestSpy, 0);
                });

                it('... query is null', () => {
                    let expectedQuery: null;

                    component.onSearch(expectedQuery);
                    fixture.detectChanges();

                    expectSpyCall(searchRequestSpy, 0);
                });

                it('... query has type `never`', () => {
                    let expectedQuery: never;

                    component.onSearch(expectedQuery);
                    fixture.detectChanges();

                    expectSpyCall(searchRequestSpy, 0);
                });

                it('... query (and searchForm) is invalid', () => {
                    const expectedQuery = 'a';

                    component.searchvalControl.setValue(expectedQuery);
                    component.onSearch(expectedQuery);
                    fixture.detectChanges();

                    expectSpyCall(searchRequestSpy, 0);
                });
            });

            it('... should emit a given query if searchForm is valid', () => {
                const expectedQuery = expectedSearchValue;

                component.searchvalControl.setValue(expectedQuery);
                component.onSearch(expectedQuery);
                fixture.detectChanges();

                expectSpyCall(searchRequestSpy, 1, expectedSearchValue);
            });
        });
    });
});
