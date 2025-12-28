import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { MskEmptyStateComponent } from './empty-state.component';

describe('MskEmptyStateComponent', () => {
  let component: MskEmptyStateComponent;
  let fixture: ComponentFixture<MskEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), MskEmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
