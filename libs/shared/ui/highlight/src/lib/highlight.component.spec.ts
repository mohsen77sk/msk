import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskHighlightComponent } from './highlight.component';

describe('MskHighlightComponent', () => {
  let component: MskHighlightComponent;
  let fixture: ComponentFixture<MskHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskHighlightComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
