/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Input } from '@angular/core';

import { getAndExpectDebugElementByDirective } from '@testing/expect-helper';

import { BibliographyListComponent } from './bibliography-list.component';

@Component({ selector: 'awg-bibliography-detail', template: '' })
class BibliographyDetailStubComponent {
    @Input()
    objId: string;
}

describe('BibliographyListComponent', () => {
    let component: BibliographyListComponent;
    let fixture: ComponentFixture<BibliographyListComponent>;
    let compDe: DebugElement;
    let compEl: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BibliographyListComponent, BibliographyDetailStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
        compEl = compDe.nativeElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get bibList input', () => {
            expect(component.bibList).toBeUndefined('should be undefined');
        });

        describe('VIEW', () => {
            it('... should not contain bibliography detail component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, BibliographyDetailStubComponent, 0, 0);
            });
        });
    });
});
