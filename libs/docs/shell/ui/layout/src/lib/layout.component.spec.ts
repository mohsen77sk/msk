import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MSK_LAYOUT_CONFIG } from '@msk/shared/services/config';
import { DocsLayoutComponent } from './layout.component';

describe('DocsLayoutComponent', () => {
  let component: DocsLayoutComponent;
  let fixture: ComponentFixture<DocsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsLayoutComponent],
      providers: [provideRouter([]), { provide: MSK_LAYOUT_CONFIG, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
