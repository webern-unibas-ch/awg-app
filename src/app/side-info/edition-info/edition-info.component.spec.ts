/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';
import { RouterLinkStubDirective } from 'testing/router-stubs';
import { Meta, MetaContact, MetaEdition, MetaPage, MetaSectionTypes, MetaStructure } from '@awg-core/core-models';
import { METADATA } from '@awg-core/mock-data';
import { CoreService } from '@awg-core/services';

import { EditionInfoComponent } from './edition-info.component';

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockCoreService: Partial<CoreService>;

    let expectedEditionMetaData: MetaEdition;
    let expectedEditionInfoHeaderOp12;
    let expectedEditionInfoHeaderOp25;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaDataSection: sectionType => METADATA[sectionType]
        };

        TestBed.configureTestingModule({
            declarations: [EditionInfoComponent, RouterLinkStubDirective],
            providers: [{ provide: CoreService, useValue: mockCoreService }]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionInfoComponent);
        component = fixture.componentInstance;

        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        // test data
        expectedEditionMetaData = METADATA[MetaSectionTypes.edition];
        expectedEditionInfoHeaderOp12 = {
            section: 'AWG I/5',
            title: 'Vier Lieder',
            catalogueType: 'op.',
            catalogueNumber: '12',
            part: 'Skizzen',
            description: '[Beispieledition ausgewählter Skizzen]'
        };
        expectedEditionInfoHeaderOp25 = {
            section: 'AWG I/5',
            title: 'Drei Lieder nach Gedichten von Hildegard Jone',
            catalogueType: 'op.',
            catalogueNumber: '25',
            part: 'Graph',
            description: '[Beispieledition ausgewählter Skizzen]'
        };

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
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);
    });

    it('changing the stub service has no effect on the injected service', () => {
        const coreService = TestBed.get(CoreService);
        const CHANGEDMETA: Meta = {
            page: new MetaPage(),
            edition: new MetaEdition(),
            structure: new MetaStructure(),
            contact: new MetaContact()
        };
        mockCoreService = { getMetaDataSection: sectionType => CHANGEDMETA[sectionType] };

        expect(coreService.getMetaDataSection(MetaSectionTypes.edition)).toBe(expectedEditionMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have editionInfoHeaderOp12', () => {
            expect(component.editionInfoHeaderOp12).toBeDefined();
            expect(component.editionInfoHeaderOp12).toEqual(
                expectedEditionInfoHeaderOp12,
                `should equal ${expectedEditionInfoHeaderOp12}`
            );
        });

        it('... should have editionInfoHeaderOp25', () => {
            expect(component.editionInfoHeaderOp25).toBeDefined();
            expect(component.editionInfoHeaderOp25).toEqual(
                expectedEditionInfoHeaderOp25,
                `should equal ${expectedEditionInfoHeaderOp25}`
            );
        });

        describe('#provideMetaData', () => {
            it('... should not have been called', () => {
                expect(component.provideMetaData).not.toHaveBeenCalled();
            });

            it('... should not have structureMetaData', () => {
                expect(component.editionMetaData).toBeUndefined('should be undefined');
            });
        });

        describe('VIEW', () => {
            it('... should contain 1 div.card with div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card div.card-body', 1, 1);
            });

            it('... should contain two `h6` header and 5 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h6.awg-edition-info-header', 2, 2);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 5, 5);
            });

            it('... should not render editor information yet', () => {
                const editorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-edition-info-editors a', 1, 1);
                const editorEl = editorDes[0].nativeElement;

                expect(editorEl).toBeDefined();
                expect(editorEl.href).toBe('', 'should be empty string');
                expect(editorEl.innerHTML).toBe('', 'should be empty string');
            });

            it('... should not render last modification date yet', () => {
                const dateDes = getAndExpectDebugElementByCss(compDe, 'span#awg-edition-info-lastmodified', 1, 1);
                const dateEl = dateDes[0].nativeElement;

                expect(dateEl.textContent).toBeDefined();
                expect(dateEl.textContent).toBe('', 'should be empty string');
            });
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the call to the meta service in #provideMetaData
            component.editionMetaData = mockCoreService.getMetaDataSection(MetaSectionTypes.edition);

            // trigger initial data binding
            fixture.detectChanges();
        });

        describe('#provideMetaData', () => {
            it('... should have been called', () => {
                expect(component.provideMetaData).toHaveBeenCalled();
            });

            it('... should return editionMetaData', () => {
                expect(component.editionMetaData).toBeDefined();
                expect(component.editionMetaData).toBe(expectedEditionMetaData);
            });
        });

        describe('VIEW', () => {
            it('should render editor information', () => {
                const expectedEditor = expectedEditionMetaData.editors[0];

                const editorDes = getAndExpectDebugElementByCss(compDe, 'span.awg-edition-info-editors a', 1, 1);
                const editorEl = editorDes[0].nativeElement;

                expect(editorEl).toBeDefined();
                expect(editorEl.href).toBe(expectedEditor.contactUrl, `should be ${expectedEditor.contactUrl}`);
                expect(editorEl.innerHTML).toBe(expectedEditor.name, `should be ${expectedEditor.name}`);
            });

            it('should render last modification date', () => {
                const expectedLastModified = expectedEditionMetaData.lastModified;

                const lastmodDes = getAndExpectDebugElementByCss(compDe, 'span#awg-edition-info-lastmodified', 1, 1);
                const lastmodEl = lastmodDes[0].nativeElement;

                expect(lastmodEl.textContent).toBeDefined();
                expect(lastmodEl.textContent).toContain(expectedLastModified, `should contain ${expectedLastModified}`);
            });
        });
    });
});
