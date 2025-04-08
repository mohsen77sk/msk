import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsPanelTypographyComponent } from './typography.component';

describe('DocsPanelTypographyComponent', () => {
  let component: DocsPanelTypographyComponent;
  let fixture: ComponentFixture<DocsPanelTypographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsPanelTypographyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsPanelTypographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
