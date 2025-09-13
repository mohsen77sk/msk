import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsPageLayoutsOverviewComponent } from './overview.component';

describe('DocsPageLayoutsOverviewComponent', () => {
  let component: DocsPageLayoutsOverviewComponent;
  let fixture: ComponentFixture<DocsPageLayoutsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsPageLayoutsOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsPageLayoutsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
