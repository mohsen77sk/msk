import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskEmptyStateComponent } from './empty-state.component';

describe('MskEmptyStateComponent', () => {
  let component: MskEmptyStateComponent;
  let fixture: ComponentFixture<MskEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
