import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgModule } from '@angular/core';

import { NgbConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { TablePaginationComponent } from './table-pagination.component';

describe('TablePaginationComponent', () => {
    let component: TablePaginationComponent;
    let fixture: ComponentFixture<TablePaginationComponent>;

    // global NgbConfigModule
    @NgModule({ imports: [NgbPaginationModule], exports: [NgbPaginationModule] })
    class NgbConfigModule {
        constructor(config: NgbConfig) {
            // Set animations to false
            config.animation = false;
        }
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NgbConfigModule],
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
