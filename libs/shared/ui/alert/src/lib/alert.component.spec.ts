import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MskAlertComponent } from './alert.component';

describe('MskAlertComponent', () => {
  let component: MskAlertComponent;
  let fixture: ComponentFixture<MskAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskAlertComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(MskAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
