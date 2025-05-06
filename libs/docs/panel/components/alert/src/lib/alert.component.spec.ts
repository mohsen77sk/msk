import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocAlertComponent } from './alert.component';

describe('DocAlertComponent', () => {
  let component: DocAlertComponent;
  let fixture: ComponentFixture<DocAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
