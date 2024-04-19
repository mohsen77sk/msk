import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskVerticalNavigationComponent } from './vertical-navigation.component';

describe('MskVerticalNavigationComponent', () => {
  let component: MskVerticalNavigationComponent;
  let fixture: ComponentFixture<MskVerticalNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskVerticalNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskVerticalNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
