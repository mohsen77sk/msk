import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DocsAnimationsComponent } from './animations.component';

describe('DocsAnimationsComponent', () => {
  let component: DocsAnimationsComponent;
  let fixture: ComponentFixture<DocsAnimationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsAnimationsComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsAnimationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
