import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { MaintenanceComponent } from './maintenance.component';

describe('MaintenanceComponent', () => {
  let component: MaintenanceComponent;
  let fixture: ComponentFixture<MaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), MaintenanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
