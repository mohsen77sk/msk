import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsMediaWatcherComponent } from './media-watcher.component';

describe('DocsMediaWatcherComponent', () => {
  let component: DocsMediaWatcherComponent;
  let fixture: ComponentFixture<DocsMediaWatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsMediaWatcherComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsMediaWatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
