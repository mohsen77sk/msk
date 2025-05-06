import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocFullscreenComponent } from './fullscreen.component';

describe('DocFullscreenComponent', () => {
  let component: DocFullscreenComponent;
  let fixture: ComponentFixture<DocFullscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocFullscreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocFullscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
