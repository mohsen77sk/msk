import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MSK_LAYOUT_CONFIG } from '@msk/shared/services/config';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { MskDialogComponent } from './dialog.component';

describe('MskDialogComponent', () => {
  let component: MskDialogComponent;
  let fixture: ComponentFixture<MskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), MatDialogModule, MskDialogComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: MatDialogRef, useValue: {} },
        { provide: MSK_LAYOUT_CONFIG, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
