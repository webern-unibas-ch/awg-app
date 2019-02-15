/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BibliographyListComponent } from './bibliography-list.component';

@Component({ selector: 'awg-bibliography-detail', template: '' })
class BibliographyDetailStubComponent {
    @Input()
    objId: string;
}

describe('BibliographyListComponent', () => {
    let component: BibliographyListComponent;
    let fixture: ComponentFixture<BibliographyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BibliographyListComponent, BibliographyDetailStubComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BibliographyListComponent);
        component = fixture.componentInstance;
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
                const bibliographyDetailEl = fixture.debugElement.query(By.directive(BibliographyDetailStubComponent));

                expect(bibliographyDetailEl).not.toBeTruthy();
            });
        });
    });
});
