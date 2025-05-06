import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocHighlightComponent } from './highlight.component';

describe('DocHighlightComponent', () => {
  let component: DocHighlightComponent;
  let fixture: ComponentFixture<DocHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocHighlightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
