import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MskAvatarComponent } from './avatar.component';

describe('MskAvatarComponent', () => {
  let component: MskAvatarComponent;
  let fixture: ComponentFixture<MskAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MskAvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MskAvatarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
