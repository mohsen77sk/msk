import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MSK_LAYOUT_CONFIG } from '@msk/shared/services/config';
import { MainLayoutMaterialComponent } from './material.component';

describe('MainLayoutMaterialComponent', () => {
  let component: MainLayoutMaterialComponent;
  let fixture: ComponentFixture<MainLayoutMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [provideAnimationsAsync(), HttpClientTestingModule, MainLayoutMaterialComponent],
      providers: [{ provide: MSK_LAYOUT_CONFIG, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
