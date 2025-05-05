import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsSplashScreenComponent } from './splash-screen.component';

describe('DocsSplashScreenComponent', () => {
  let component: DocsSplashScreenComponent;
  let fixture: ComponentFixture<DocsSplashScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsSplashScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsSplashScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
