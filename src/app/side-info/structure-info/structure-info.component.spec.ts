import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { METADATA } from '@awg-core/core-data';
import { MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { StructureInfoComponent } from './structure-info.component';

describe('StructureInfoComponent (DONE)', () => {
    let component: StructureInfoComponent;
    let fixture: ComponentFixture<StructureInfoComponent>;
    let compDe: DebugElement;

    let mockCoreService: Partial<CoreService>;

    let expectedStructureMetaData: MetaStructure;
    const expectedStructureInfoHeader = 'Strukturmodell';

    beforeEach(waitForAsync(() => {
        // Stub service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        TestBed.configureTestingModule({
            declarations: [StructureInfoComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureInfoComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;

        // Test data
        expectedStructureMetaData = METADATA[MetaSectionTypes.structure];

        // Spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('injected service should use provided mockValue', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(true);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have structureInfoHeader', () => {
            expect(component.structureInfoHeader).toBeDefined();
            expect(component.structureInfoHeader)
                .withContext(`should be ${expectedStructureInfoHeader}`)
                .toBe(expectedStructureInfoHeader);
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have structureMetaData', () => {
                expect(component.structureMetaData).toBeUndefined();
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain one `h5` header and 4 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-structure-info-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 4, 4);
            });

            it('... should not render `structureInfoHeader` yet', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-structure-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBeFalsy();
            });

            it('... should not render author information yet', () => {
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl = authorDes[0].nativeElement;

                expect(authorEl).toBeDefined();
                expect(authorEl.href).toBeFalsy();
                expect(authorEl.innerHTML).toBeFalsy();
            });

            it('... should not render last modification date yet', () => {
                const dateDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const dateEl = dateDes[0].nativeElement;

                expect(dateEl).toBeDefined();
                expect(dateEl.textContent).toBeFalsy();
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // Mock the call to the meta service in #provideMetaData
            component.structureMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.structure);

            // Trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return structureMetaData', () => {
                expect(component.structureMetaData).toBeDefined();
                expect(component.structureMetaData)
                    .withContext(`should be ${expectedStructureMetaData}`)
                    .toBe(expectedStructureMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should render `structureInfoHeader`', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-structure-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent)
                    .withContext(`should be ${expectedStructureInfoHeader}`)
                    .toBe(expectedStructureInfoHeader);
            });

            it('should render author information', () => {
                const expectedAuthor = expectedStructureMetaData.authors[0];

                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl = authorDes[0].nativeElement;

                expect(authorEl).toBeDefined();
                expect(authorEl.href).withContext(`should be ${expectedAuthor.homepage}`).toBe(expectedAuthor.homepage);
                expect(authorEl.innerHTML).withContext(`should be ${expectedAuthor.name}`).toBe(expectedAuthor.name);
            });

            it('should render last modification date', () => {
                const expectedLastModified = expectedStructureMetaData.lastModified;

                const lastmodDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const lastmodEl = lastmodDes[0].nativeElement;

                expect(lastmodEl.textContent).toBeDefined();
                expect(lastmodEl.textContent)
                    .withContext(`should contain ${expectedLastModified}`)
                    .toContain(expectedLastModified);
            });
        });
    });
});
