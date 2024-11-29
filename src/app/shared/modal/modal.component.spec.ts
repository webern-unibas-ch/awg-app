import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDismissReasons, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import Spy = jasmine.Spy;

import { cleanStylesFromDOM } from '@testing/clean-up-helper';
import { expectSpyCall, expectToBe, getAndExpectDebugElementByCss } from '@testing/expect-helper';

import { CompileHtmlComponent } from '@awg-shared/compile-html';

import { ModalComponent } from './modal.component';

// Mock wrapper component for the modal content
@Component({
    template: `
        <div>
            <ng-container *ngTemplateOutlet="modal"> </ng-container>
        </div>
        <awg-modal> </awg-modal>
    `,
})
class WrapperComponent implements AfterViewInit {
    @ViewChild(ModalComponent) modalComponentRef: ModalComponent;
    modal: TemplateRef<any>;
    constructor(private cdr: ChangeDetectorRef) {}
    ngAfterViewInit() {
        this.modal = this.modalComponentRef.modalTemplate;
        this.cdr.detectChanges();
    }
}

// Mock class for NgbModalRef
export class MockNgbModalRef {
    componentInstance = {
        title: undefined,
        content: undefined,
    };
    result: Promise<any> = new Promise(resolve => resolve(''));
}

describe('ModalComponent', () => {
    let component: ModalComponent;
    let wrapperComponent: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;
    let wrapperDe: DebugElement;

    let ngbModal: NgbModal;
    const mockModalRef: MockNgbModalRef = new MockNgbModalRef();
    let ngbModalOpenSpy: Spy;

    let mockDocument: Document;

    const expectedModalTitle = 'Hinweis';
    const expectedModalCloseLabel = 'Schließen';
    const EXPECTED_MODAL_CONTENT_SNIPPETS = {
        OP12_SOURCE_NOT_AVAILABLE:
            '<p>Die Beschreibung der weiteren Quellenbestandteile von <strong>A</strong> sowie der Quellen <strong>C</strong> bis <strong>G<sup>H</sup></strong> einschließlich der darin gegebenenfalls enthaltenen Korrekturen erfolgt im Zusammenhang der vollständigen Edition der <em>Vier Lieder</em> op. 12 in AWG I/5.</p>',
        OP12_SHEET_COMING_SOON:
            'Die edierten Notentexte der Skizzen zu M 213 (<strong>A<sup>c</sup></strong>), M 216 (<strong>A<sup>d</sup></strong>) und M 217 (<strong>A<sup>b</sup></strong>) erscheinen im Zusammenhang der vollständigen Edition der <em>Vier Lieder</em> op. 12 in AWG I/5.',
    };
    const expectedSnippetKey1 = 'OP12_SOURCE_NOT_AVAILABLE';
    const expectedSnippetKey2 = 'OP12_SHEET_COMING_SOON';
    const expectedUnknownSnippetKey = 'UNKNOWN_SNIPPET_KEY';

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NgbModalModule],
            declarations: [WrapperComponent, ModalComponent, CompileHtmlComponent],
            providers: [NgbModal],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WrapperComponent);
        wrapperComponent = fixture.debugElement.componentInstance;
        fixture.detectChanges(); // Initial data binding of wrapper component.

        wrapperDe = fixture.debugElement;
        component = wrapperComponent.modalComponentRef;
        // Trigger initial data binding of modal component
        fixture.detectChanges();

        ngbModal = TestBed.inject(NgbModal);
        mockDocument = TestBed.inject(DOCUMENT);

        // Spies on the modal service
        ngbModalOpenSpy = spyOn(ngbModal, 'open').and.returnValue(mockModalRef as any);
    });

    afterAll(() => {
        cleanStylesFromDOM();
    });

    it('... should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('... should create the wrapper component', () => {
        expect(wrapperComponent).toBeTruthy();
    });

    it('... should have modal title', () => {
        expectToBe(component.modalTitle, expectedModalTitle);
    });

    it('... should have modal close label', () => {
        expectToBe(component.modalCloseLabel, expectedModalCloseLabel);
    });

    it('... should recognize the modal template', () => {
        expectToBe(component.modalTemplate, wrapperComponent.modal);
        expect(component.modalTemplate).toBeInstanceOf(TemplateRef);
    });

    it('... should recognize the modal template in wrapper component', () => {
        expect(wrapperComponent.modal).toBeDefined();
    });

    it('... should not have modal content', () => {
        expect(component.modalContent).toBeUndefined();
    });

    it('... should not have closeResult', () => {
        expect(component.closeResult).toBeUndefined();
    });

    describe('VIEW', () => {
        it('... should have one div.modal-header', () => {
            getAndExpectDebugElementByCss(wrapperDe, 'div.modal-header', 1, 1);
        });

        it('... should have h4.modal-title in div.modal-header', () => {
            const divDes = getAndExpectDebugElementByCss(wrapperDe, 'div.modal-header', 1, 1);
            getAndExpectDebugElementByCss(divDes[0], 'h4.modal-title', 1, 1);
        });

        it('... should render the modal title label', () => {
            const divDes = getAndExpectDebugElementByCss(wrapperDe, 'div.modal-header', 1, 1);
            const hDes = getAndExpectDebugElementByCss(divDes[0], 'h4.modal-title', 1, 1);
            const hEl: HTMLHeadingElement = hDes[0].nativeElement;

            expectToBe(hEl.textContent, expectedModalTitle);
        });

        it('... should have close button without label in div.modal-header', () => {
            const divDes = getAndExpectDebugElementByCss(wrapperDe, 'div.modal-header', 1, 1);
            const btnDes = getAndExpectDebugElementByCss(divDes[0], 'button.btn-close', 1, 1);
            const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

            expectToBe(btnEl.textContent, '');
        });

        it('... should have one div.modal-body', () => {
            getAndExpectDebugElementByCss(wrapperDe, 'div.modal-body', 1, 1);
        });

        it('... should render the modal content in div.modal-body', () => {
            component.open(expectedSnippetKey1);
            fixture.detectChanges();

            const bodyDes = getAndExpectDebugElementByCss(wrapperDe, 'div.modal-body', 1, 1);
            const bodyEl: HTMLDivElement = bodyDes[0].nativeElement;

            // Process HTML expression of content snippet
            const htmlSnippet = mockDocument.createElement('p');
            htmlSnippet.innerHTML = EXPECTED_MODAL_CONTENT_SNIPPETS[expectedSnippetKey1];

            expectToBe(bodyEl.textContent.trim(), htmlSnippet.textContent.trim());
        });

        it('... should have one div.modal-footer', () => {
            getAndExpectDebugElementByCss(wrapperDe, 'div.modal-footer', 1, 1);
        });

        it('... should have one close button.awg-modal-button in div.modal-footer', () => {
            const footerDes = getAndExpectDebugElementByCss(wrapperDe, 'div.modal-footer', 1, 1);
            getAndExpectDebugElementByCss(footerDes[0], 'button.awg-modal-button', 1, 1);
        });

        it('... should render the modal close label', () => {
            const footerDes = getAndExpectDebugElementByCss(wrapperDe, 'div.modal-footer', 1, 1);
            const btnDes = getAndExpectDebugElementByCss(footerDes[0], 'button.awg-modal-button', 1, 1);
            const btnEl: HTMLButtonElement = btnDes[0].nativeElement;

            expectToBe(btnEl.textContent.trim(), expectedModalCloseLabel);
        });
    });

    describe('#open()', () => {
        beforeEach(() => {
            component.open(expectedSnippetKey1);
        });

        it('... should have a method `open`', () => {
            expect(component.open).toBeDefined();
        });

        it('... should open the modal via ngbModal', () => {
            // Modal is open
            expectSpyCall(ngbModalOpenSpy, 1, [component.modalTemplate, { ariaLabelledBy: 'awg-modal' }]);
            expect(component.closeResult).toBeUndefined();
        });

        it('... should set the correct modal content if snippet is known', () => {
            expectToBe(component.modalContent, EXPECTED_MODAL_CONTENT_SNIPPETS[expectedSnippetKey1]);

            component.open(expectedSnippetKey2);
            fixture.detectChanges();

            expectToBe(component.modalContent, EXPECTED_MODAL_CONTENT_SNIPPETS[expectedSnippetKey2]);
        });

        it('... should set the modal content to empty string if snippet is unknown', () => {
            component.open(expectedUnknownSnippetKey);
            fixture.detectChanges();

            expectToBe(component.modalContent, '');
        });

        it('... should return the close result of the modal', async () => {
            const closeMessage = `Click on ${expectedModalCloseLabel}`;
            const expectedCloseResult = `Closed with: ${closeMessage}`;
            mockModalRef.result = new Promise(resolve => resolve(closeMessage));

            component.open(expectedSnippetKey1);
            fixture.detectChanges();

            await expectAsync(
                ngbModal.open(component.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result
            ).toBeResolvedTo(closeMessage);

            expectToBe(component.closeResult, expectedCloseResult);
        });

        describe('should return the dismiss reason of the modal', async () => {
            it('... when clicking on close button', async () => {
                const dismissEvent = 'Click on dismiss button';
                const expectedDismissReason = `Dismissed with: ${dismissEvent}`;
                mockModalRef.result = new Promise((_resolve, reject) => reject(dismissEvent));

                component.open(expectedSnippetKey1);
                fixture.detectChanges();

                await expectAsync(
                    ngbModal.open(component.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result
                ).toBeRejectedWith(dismissEvent);

                expectToBe(component.closeResult, expectedDismissReason);
            });

            it('... when pressing ESC key', async () => {
                const dismissEvent = ModalDismissReasons.ESC;
                const expectedDismissReason = `Dismissed by pressing ESC`;
                mockModalRef.result = new Promise((_resolve, reject) => reject(dismissEvent));

                component.open(expectedSnippetKey1);
                fixture.detectChanges();

                await expectAsync(
                    ngbModal.open(component.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result
                ).toBeRejectedWith(dismissEvent);

                expectToBe(component.closeResult, expectedDismissReason);
            });

            it('... when clicking on backdrop', async () => {
                const dismissEvent = ModalDismissReasons.BACKDROP_CLICK;
                const expectedDismissReason = `Dismissed by clicking on a backdrop`;
                mockModalRef.result = new Promise((_resolve, reject) => reject(dismissEvent));

                component.open(expectedSnippetKey1);
                fixture.detectChanges();

                await expectAsync(
                    ngbModal.open(component.modalTemplate, { ariaLabelledBy: 'awg-modal' }).result
                ).toBeRejectedWith(dismissEvent);

                expectToBe(component.closeResult, expectedDismissReason);
            });
        });
    });
});
