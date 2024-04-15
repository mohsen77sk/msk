import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { MskServiceWorkerSnackBarComponent } from './service-worker-snack-bar.component';

describe('MskServiceWorkerSnackBarComponent', () => {
  let component: MskServiceWorkerSnackBarComponent;
  let fixture: ComponentFixture<MskServiceWorkerSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MskTranslocoTestingModule(),
        ServiceWorkerModule.register('', { enabled: false }),
        MskServiceWorkerSnackBarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MskServiceWorkerSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
