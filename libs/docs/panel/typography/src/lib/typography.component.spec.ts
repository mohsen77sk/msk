import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsTypographyComponent } from './typography.component';

describe('DocsTypographyComponent', () => {
  let component: DocsTypographyComponent;
  let fixture: ComponentFixture<DocsTypographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsTypographyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsTypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
