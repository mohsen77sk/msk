import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsSnackBarComponent } from './snack-bar.component';

describe('DocsSnackBarComponent', () => {
  let component: DocsSnackBarComponent;
  let fixture: ComponentFixture<DocsSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsSnackBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
