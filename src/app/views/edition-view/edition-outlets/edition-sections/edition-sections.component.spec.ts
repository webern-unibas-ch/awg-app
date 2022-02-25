import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RouterOutletStubComponent } from '@testing/router-stubs';

import { EditionSectionsComponent } from './edition-sections.component';

describe('EditionSectionsComponent', () => {
    let component: EditionSectionsComponent;
    let fixture: ComponentFixture<EditionSectionsComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [EditionSectionsComponent, RouterOutletStubComponent],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(EditionSectionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
