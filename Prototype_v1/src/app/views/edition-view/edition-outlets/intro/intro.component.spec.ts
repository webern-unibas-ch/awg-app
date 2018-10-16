/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLinkStubDirective } from '@testing/router-stubs';

import { IntroComponent } from './intro.component';
import { SharedModule } from '@awg-shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('IntroComponent', () => {
    let component: IntroComponent;
    let fixture: ComponentFixture<IntroComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule, RouterTestingModule],
            declarations: [IntroComponent, RouterLinkStubDirective]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
