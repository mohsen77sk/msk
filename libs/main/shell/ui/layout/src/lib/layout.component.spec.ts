import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { MSK_LAYOUT_CONFIG } from '@msk/shared/services/config';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, RouterModule.forRoot([])],
      providers: [{ provide: MSK_LAYOUT_CONFIG, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
