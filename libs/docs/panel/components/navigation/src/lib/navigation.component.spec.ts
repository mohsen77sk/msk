import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DocNavigationComponent } from './navigation.component';

describe('DocNavigationComponent', () => {
  let component: DocNavigationComponent;
  let fixture: ComponentFixture<DocNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocNavigationComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
