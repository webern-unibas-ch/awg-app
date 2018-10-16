import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceDetailHtmlContentPropsComponent } from './props.component';
import { SharedModule } from '@awg-shared/shared.module';

describe('ResourceDetailHtmlContentPropsComponent', () => {
    let component: ResourceDetailHtmlContentPropsComponent;
    let fixture: ComponentFixture<ResourceDetailHtmlContentPropsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [ResourceDetailHtmlContentPropsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResourceDetailHtmlContentPropsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
