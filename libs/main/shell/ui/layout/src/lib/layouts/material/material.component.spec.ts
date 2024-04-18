import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutMaterialComponent } from './material.component';

describe('MainLayoutMaterialComponent', () => {
  let component: MainLayoutMaterialComponent;
  let fixture: ComponentFixture<MainLayoutMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutMaterialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});