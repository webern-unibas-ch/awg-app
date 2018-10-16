/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BibliographyListComponent } from './bibliography-list.component';

import { SubjectItemJson } from '@awg-shared/api-objects';

@Component({ selector: 'awg-bibliography-detail', template: '' })
class BibliographyDetailStubComponent {
    @Input()
    objId: string;
}

describe('BibliographyListComponent', () => {
    let component: BibliographyListComponent;
    let fixture: ComponentFixture<BibliographyListComponent>;
    let expectedBibList: SubjectItemJson[];

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

        it('should not contain bibliography detail component (stubbed)', () => {
            const bibliographyDetailEl = fixture.debugElement.query(By.directive(BibliographyDetailStubComponent));
            expect(bibliographyDetailEl).not.toBeTruthy();
        });
    });

    describe('AFTER initial data binding', () => {
        beforeEach(() => {
            // mock the inputs supplied by the parent component
            const bibItem: SubjectItemJson = {
                iconlabel: '',
                iconsrc: '',
                icontitle: '',
                obj_id: '1234',
                preview_nx: null,
                preview_ny: null,
                preview_path: '',
                rights: '',
                value: [],
                valuelabel: [''],
                valuetype_id: ['']
            };

            expectedBibList = [];
            expectedBibList.push(bibItem);

            // simulate the parent setting the input properties
            component.bibList = expectedBibList;

            // trigger initial data binding
            fixture.detectChanges();
        });

        it('should get bibList input', () => {
            expect(component.bibList).toBe(expectedBibList);
        });

        it('should contain bibliography detail component (stubbed) if objId`s match', () => {
            // apply test bib item to selectedBibItem
            component.selectedBibItem = expectedBibList[0];
            fixture.detectChanges();
            console.warn('bibItem', component.selectedBibItem);
            const bibliographyDetailEl = fixture.debugElement.query(By.directive(BibliographyDetailStubComponent));
            console.warn(bibliographyDetailEl);
            expect(bibliographyDetailEl).toBeTruthy();
        });

        it('TODO: test click method and output', () => {});
    });
});
