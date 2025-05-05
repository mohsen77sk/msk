import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsColorsComponent } from './colors.component';

describe('DocsColorsComponent', () => {
  let component: DocsColorsComponent;
  let fixture: ComponentFixture<DocsColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsColorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
