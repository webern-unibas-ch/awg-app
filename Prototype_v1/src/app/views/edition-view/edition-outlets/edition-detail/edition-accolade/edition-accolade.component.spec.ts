import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { EditionAccoladeComponent } from './edition-accolade.component';
import { EditionSvgFile, EditionSvgOverlay, Textcritics } from '@awg-views/edition-view/models';

// mock components
@Component({ selector: 'awg-edition-svg-file-nav', template: '' })
class EditionSvgFileNavStubComponent {
    @Input()
    svgFileData: EditionSvgFile[];
    @Input()
    selectedSvgFile: EditionSvgFile;

    // TODO: handle outputs
}

@Component({ selector: 'awg-edition-svg-file', template: '' })
class EditionSvgFileStubComponent {
    @Input()
    selectedSvgFile: EditionSvgFile;
    @Input()
    selectedOverlay: EditionSvgOverlay;

    // TODO: handle outputs
}

@Component({ selector: 'awg-edition-tka-table', template: '' })
class EditionTkaTableStubComponent {
    @Input()
    selectedTextcritics: Textcritics[];

    // TODO: handle outputs
}

describe('EditionAccoladeComponent', () => {
    let component: EditionAccoladeComponent;
    let fixture: ComponentFixture<EditionAccoladeComponent>;
    let compDe: DebugElement;
    let compEl: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                EditionAccoladeComponent,
                EditionSvgFileStubComponent,
                EditionSvgFileNavStubComponent,
                EditionTkaTableStubComponent
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionAccoladeComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
