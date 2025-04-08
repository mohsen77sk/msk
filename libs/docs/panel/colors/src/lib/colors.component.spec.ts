import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsPanelColorsComponent } from './colors.component';

describe('DocsPanelColorsComponent', () => {
  let component: DocsPanelColorsComponent;
  let fixture: ComponentFixture<DocsPanelColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsPanelColorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsPanelColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
