import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { Store, StoreService } from '@msk/mirza/shell/core/store';
import { UserService } from '@msk/mirza/shell/core/user';
import { MskLayoutConfigService } from '@msk/shared/services/config';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let storeService: {
    currentStore: Store | null;
    currentStore$: BehaviorSubject<Store | null>;
    stores$: BehaviorSubject<Store[]>;
    uploadStoreLogo: jest.Mock;
  };

  beforeEach(async () => {
    const currentStore = new Store({
      id: 1,
      name: 'Main store',
      status: true,
      logoUrl: null,
    });

    storeService = {
      currentStore,
      currentStore$: new BehaviorSubject<Store | null>(currentStore),
      stores$: new BehaviorSubject<Store[]>([currentStore]),
      uploadStoreLogo: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        provideRouter([]),
        {
          provide: StoreService,
          useValue: storeService,
        },
        {
          provide: UserService,
          useValue: {
            user$: of(null),
          },
        },
        {
          provide: MskLayoutConfigService,
          useValue: {
            config$: of({
              lang: 'fa',
              scheme: 'auto',
              currency: 'IRR',
            }),
          },
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn(() => ({ afterClosed: () => of(null) })),
          },
        },
      ],
    })
      .overrideComponent(UserComponent, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('rejects logo files over 2MB', () => {
    const file = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'large.png', {
      type: 'image/png',
    });
    const event = {
      target: {
        files: [file],
        value: 'large.png',
      },
    } as unknown as Event;

    component.uploadCurrentStoreLogo(event);

    expect(component.logoUploadError()).toBe('Logo must be smaller than 2MB.');
    expect(storeService.uploadStoreLogo).not.toHaveBeenCalled();
  });

  it('updates logo through StoreService after valid upload', () => {
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });
    const updatedStore = new Store({
      id: 1,
      name: 'Main store',
      status: true,
      logoUrl: 'https://cdn.example.com/store-logos/logo.png',
    });
    storeService.uploadStoreLogo.mockReturnValue(of(updatedStore));
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: jest.fn(() => 'blob:logo'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: jest.fn(),
    });
    jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:logo');
    jest.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const event = {
      target: {
        files: [file],
        value: 'logo.png',
      },
    } as unknown as Event;

    component.uploadCurrentStoreLogo(event);

    expect(storeService.uploadStoreLogo).toHaveBeenCalledWith(1, file);
    expect(component.logoUploadError()).toBeNull();
    expect(component.isLogoUploading()).toBe(false);
  });
});
