/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { RouterLinkStubDirective } from 'testing/router-stubs';

import { MetaEdition, MetaSectionKey } from '@awg-core/core-models';
import { CoreService } from '@awg-core/services';

import { EditionInfoComponent } from './edition-info.component';
import { METADATA } from '@awg-core/mock-data';
import { getAndExpectDebugElementByCss } from '@testing/expect-helper';

describe('EditionInfoComponent (DONE)', () => {
    let component: EditionInfoComponent;
    let fixture: ComponentFixture<EditionInfoComponent>;
    let compDe: DebugElement;
    let compEl: any;

    let mockCoreService: Partial<CoreService>;

    let expectedEditionMetaData: MetaEdition;
    let expectedEditionInfoHeader;

    beforeEach(async(() => {
        // stub service for test purposes
        mockCoreService = {
            getMetaDataSection: key => METADATA[key]
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
        expectedEditionMetaData = METADATA[MetaSectionKey.edition];
        expectedEditionInfoHeader = {
            section: 'AWG I/5',
            title: 'Vier Lieder',
            catalogueType: 'op.',
            catalogueNumber: '12',
            part: 'Skizzen',
            description: '[Beispieledition ausgewählter Skizzen zu op. 12 Nr. 1]'
        };

        // spies on component functions
        // `.and.callThrough` will track the spy down the nested describes, see
        // https://jasmine.github.io/2.0/introduction.html#section-Spies:_%3Ccode%3Eand.callThrough%3C/code%3E
        spyOn(component, 'provideMetaData').and.callThrough();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('stub service and injected coreService should not be the same', () => {
        const coreService = TestBed.get(CoreService);
        expect(mockCoreService === coreService).toBe(false);

        // changing the stub service has no effect on the injected service
        let changedEditionMetaData = new MetaEdition();
        changedEditionMetaData = {
            editors: [
                {
                    name: 'Test Editor',
                    contactUrl: 'www.example.com/test-editor'
                }
            ],
            lastModified: '2017'
        };
        mockCoreService.getMetaDataSection = () => changedEditionMetaData;

        expect(coreService.getMetaDataSection(MetaSectionKey.edition)).toBe(expectedEditionMetaData);
    });

    describe('BEFORE initial data binding', () => {
        it('... should have editionInfoHeader', () => {
            expect(component.editionInfoHeader).toBeDefined();
            expect(component.editionInfoHeader).toEqual(
                expectedEditionInfoHeader,
                `should equal ${expectedEditionInfoHeader}`
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

            it('... should contain one `h5` header and 4 `p` elements in div.card-body', () => {
                getAndExpectDebugElementByCss(compDe, 'div.card-body h5#awg-edition-info-header', 1, 1);
                getAndExpectDebugElementByCss(compDe, 'div.card-body p', 4, 4);
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
            component.editionMetaData = mockCoreService.getMetaDataSection(MetaSectionKey.edition);

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
