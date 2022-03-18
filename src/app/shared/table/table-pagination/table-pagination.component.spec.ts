import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent', () => {
    let component: TablePaginationComponent;
    let fixture: ComponentFixture<TablePaginationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TablePaginationComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TablePaginationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
