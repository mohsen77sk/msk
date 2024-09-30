import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MskVerticalNavigationComponent } from './vertical-navigation.component';

describe('MskVerticalNavigationComponent', () => {
  let component: MskVerticalNavigationComponent;
  let componentRef: ComponentRef<MskVerticalNavigationComponent>;
  let fixture: ComponentFixture<MskVerticalNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskVerticalNavigationComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(MskVerticalNavigationComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('navigation', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
