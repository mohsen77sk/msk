import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MskVerticalNavigationComponent } from './vertical-navigation.component';

describe('MskVerticalNavigationComponent', () => {
  let component: MskVerticalNavigationComponent;
  let fixture: ComponentFixture<MskVerticalNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [provideAnimationsAsync(), MskVerticalNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskVerticalNavigationComponent);
    component = fixture.componentInstance;
    component.navigation = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
