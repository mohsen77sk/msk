import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsComponent } from './accounts.component';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), AccountsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
