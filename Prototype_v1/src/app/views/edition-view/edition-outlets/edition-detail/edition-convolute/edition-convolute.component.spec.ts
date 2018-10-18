import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { EditionConvoluteComponent } from './edition-convolute.component';
import { ConvoluteFolio, EditionSvgFile } from '@awg-views/edition-view/models';

@Component({ selector: 'awg-edition-folio', template: '' })
class FolioStubComponent {
    @Input()
    convoluteData: ConvoluteFolio[];
    @Input()
    selectedSvgFile: EditionSvgFile;

    // TODO: handle outputs
}

describe('EditionConvoluteComponent', () => {
    let component: EditionConvoluteComponent;
    let fixture: ComponentFixture<EditionConvoluteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditionConvoluteComponent, FolioStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionConvoluteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
