/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

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

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BibliographyListComponent, BibliographyDetailStubComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyListComponent);
        component = fixture.componentInstance;
        compDe = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('BEFORE initial data binding', () => {
        it('should not get bibList input', () => {
            expect(component.bibList).toBeUndefined();
        });

        describe('VIEW', () => {
            it('... should not contain bibliography detail component (stubbed)', () => {
                getAndExpectDebugElementByDirective(compDe, BibliographyDetailStubComponent, 0, 0);
            });
        });
    });
});
