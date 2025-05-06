import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocLoadingBarComponent } from './loading-bar.component';

describe('DocLoadingBarComponent', () => {
  let component: DocLoadingBarComponent;
  let fixture: ComponentFixture<DocLoadingBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocLoadingBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocLoadingBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
