import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskFullscreenComponent } from './fullscreen.component';

describe('MskFullscreenComponent', () => {
  let component: MskFullscreenComponent;
  let fixture: ComponentFixture<MskFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskFullscreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
