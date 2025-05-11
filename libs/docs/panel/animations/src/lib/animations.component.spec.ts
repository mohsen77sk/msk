import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DocsAnimationsComponent } from './animations.component';

describe('DocsAnimationsComponent', () => {
  let component: DocsAnimationsComponent;
  let fixture: ComponentFixture<DocsAnimationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [provideAnimations(), DocsAnimationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsAnimationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
