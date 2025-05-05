import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsConfirmationComponent } from './confirmation.component';

describe('DocsConfirmationComponent', () => {
  let component: DocsConfirmationComponent;
  let fixture: ComponentFixture<DocsConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
