import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskTranslocoTestingModule } from '@msk/shared/utils/transloco';
import { InternalServerErrorComponent } from './internal-server-error.component';

describe('InternalServerErrorComponent', () => {
  let component: InternalServerErrorComponent;
  let fixture: ComponentFixture<InternalServerErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskTranslocoTestingModule(), InternalServerErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
