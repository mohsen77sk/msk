import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutEmptyComponent } from './empty.component';

describe('LayoutEmptyComponent', () => {
  let component: LayoutEmptyComponent;
  let fixture: ComponentFixture<LayoutEmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutEmptyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
