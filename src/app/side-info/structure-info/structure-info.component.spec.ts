import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { MetaStructure, MetaSectionTypes, Meta, MetaPage, MetaContact } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { StructureInfoComponent } from './structure-info.component';

describe('StructureInfoComponent (DONE)', () => {
    let component: StructureInfoComponent;
    let fixture: ComponentFixture<StructureInfoComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockCoreService: Partial<CoreService>;

    let expectedStructureMetaData: MetaStructure;
    const expectedStructureInfoHeader = 'Strukturmodell';

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = { getMetaDataSection: sectionType => METADATA[sectionType] };

        TestBed.configureTestingModule({
            declarations: [StructureInfoComponent],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StructureInfoComponent);
        component = fixture.componentInstance;

        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedStructureMetaData = METADATA[MetaSectionTypes.structure];

        // spies on component functions
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

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.inject(CoreService);
        expect(mockCoreService === coreService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const coreService = TestBed.inject(CoreService);
        const CHANGEDMETA: Meta = {
            page: new MetaPage(),
            structure: new MetaStructure(),
            contact: new MetaContact()
        };
        mockCoreService = { getMetaDataSection: sectionType => CHANGEDMETA[sectionType] };

        expect(coreService.getMetaDataSection(MetaSectionTypes.structure)).toBe(expectedStructureMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have structureInfoHeader', () => {
            expect(component.structureInfoHeader).toBeDefined();
            expect(component.structureInfoHeader).toBe(
                expectedStructureInfoHeader,
                `should be ${expectedStructureInfoHeader}`
            );
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have structureMetaData', () => {
                expect(component.structureMetaData).toBeUndefined('should be undefined');
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
                expect(headerEl.textContent).toBe('', 'should be empty string');
            });

            it('... should not render author information yet', () => {
                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl = authorDes[0].nativeElement;

                expect(authorEl).toBeDefined();
                expect(authorEl.href).toBe('', 'should be empty string');
                expect(authorEl.innerHTML).toBe('', 'should be empty string');
            });

            it('... should not render last modification date yet', () => {
                const dateDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const dateEl = dateDes[0].nativeElement;

                expect(dateEl.textContent).toBeDefined();
                expect(dateEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.structureMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.structure);

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return structureMetaData', () => {
                expect(component.structureMetaData).toBeDefined();
                expect(component.structureMetaData).toBe(expectedStructureMetaData);
            });
        });

        describe('VIEW', () => {
            it('... should render `structureInfoHeader`', () => {
                const headerDes = getAndExpectDebugElementByCss(compDe, 'h5#awg-structure-info-header', 1, 1);
                const headerEl = headerDes[0].nativeElement;

                expect(headerEl).toBeDefined();
                expect(headerEl.textContent).toBe(
                    expectedStructureInfoHeader,
                    `should be ${expectedStructureInfoHeader}`
                );
            });

            it('should render author information', () => {
                const expectedAuthor = expectedStructureMetaData.authors[0];

                const authorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-structure-info-author a', 1, 1);
                const authorEl = authorDes[0].nativeElement;

                expect(authorEl).toBeDefined();
                expect(authorEl.href).toBe(expectedAuthor.homepage, `should be ${expectedAuthor.homepage}`);
                expect(authorEl.innerHTML).toBe(expectedAuthor.name, `should be ${expectedAuthor.name}`);
            });

            it('should render last modification date', () => {
                const expectedLastModified = expectedStructureMetaData.lastModified;

                const lastmodDes = getAndExpectDebugElementByCss(compDe, 'span#awg-structure-info-lastmodified', 1, 1);
                const lastmodEl = lastmodDes[0].nativeElement;

                expect(lastmodEl.textContent).toBeDefined();
                expect(lastmodEl.textContent).toContain(expectedLastModified, `should contain ${expectedLastModified}`);
            });
        });
    });
});
