import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SalesCardComponent } from './card.component';

describe('SalesCardComponent', () => {
  let fixture: ComponentFixture<SalesCardComponent>;
  let matDialog: {
    open: jest.Mock;
  };
  let router: {
    navigate: jest.Mock;
    navigateByUrl: jest.Mock;
  };
  let activatedRoute: {
    snapshot: {
      url: { path: string }[];
      data: Record<string, unknown>;
      queryParamMap: ReturnType<typeof convertToParamMap>;
    };
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(SalesCardComponent);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    matDialog = {
      open: jest.fn().mockReturnValue({ afterClosed: () => of({ id: 1 }) }),
    };
    router = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn(),
    };
    activatedRoute = {
      snapshot: {
        url: [{ path: 'card' }, { path: 'new' }],
        data: {},
        queryParamMap: convertToParamMap({}),
      },
    };

    await TestBed.configureTestingModule({
      imports: [SalesCardComponent],
      providers: [
        { provide: MatDialog, useValue: matDialog },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('redirects to onboarding success when a new sale is created in onboarding mode', () => {
    activatedRoute.snapshot.queryParamMap = convertToParamMap({
      onboarding: 'true',
      returnTo: '/onboarding/first-sale/success',
    });

    createComponent();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/onboarding/first-sale/success');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('keeps normal sale close behavior when onboarding mode is not set', () => {
    createComponent();

    expect(router.navigate).toHaveBeenCalledWith(['../../'], { relativeTo: activatedRoute });
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
