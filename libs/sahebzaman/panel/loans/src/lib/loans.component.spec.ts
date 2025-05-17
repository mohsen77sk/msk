import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansComponent } from './loans.component';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';

describe('LoansComponent', () => {
  let component: LoansComponent;
  let fixture: ComponentFixture<LoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), LoansComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
