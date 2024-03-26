import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutEmptyComponent } from './empty.component';

describe('MainLayoutEmptyComponent', () => {
  let component: MainLayoutEmptyComponent;
  let fixture: ComponentFixture<MainLayoutEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutEmptyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
