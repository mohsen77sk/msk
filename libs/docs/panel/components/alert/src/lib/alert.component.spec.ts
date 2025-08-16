import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DocAlertComponent } from './alert.component';

describe('DocAlertComponent', () => {
  let component: DocAlertComponent;
  let fixture: ComponentFixture<DocAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocAlertComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
