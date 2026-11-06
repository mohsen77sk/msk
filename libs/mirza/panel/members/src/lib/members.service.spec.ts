import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MembersService } from './members.service';
import { StoreMember, StoreRole } from './members.types';

describe('MembersService', () => {
  let service: MembersService;
  let http: HttpTestingController;
  let changes: number;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MSK_APP_CONFIG, useValue: { apiEndpoint: 'https://api.test' } },
      ],
    });
    service = TestBed.inject(MembersService);
    http = TestBed.inject(HttpTestingController);
    changes = 0;
    service.changes$.subscribe(() => changes++);
  });

  afterEach(() => http.verify());

  it('maps members and roles', () => {
    let members: StoreMember[] = [];
    let roles: StoreRole[] = [];
    service.getMembers().subscribe((value) => (members = value));
    service.getRoles().subscribe((value) => (roles = value));

    http
      .expectOne('https://api.test/store-member')
      .flush([
        {
          userId: 2,
          firstName: 'Ali',
          lastName: '',
          phoneNumber: '09120000000',
          role: { id: 7, key: 'cashier', name: 'صندوق‌دار' },
        },
      ]);
    http
      .expectOne('https://api.test/store-role')
      .flush([{ id: 6, key: 'owner', name: 'مالک', permissions: ['members.manage'], memberCount: 1 }]);

    expect(members[0].fullName).toBe('Ali');
    expect(roles[0].isOwner).toBe(true);
  });

  it('adds, changes and removes members, and signals each change', () => {
    service.addMember({ phone: '09120000000', roleId: 7 }).subscribe();
    const add = http.expectOne('https://api.test/store-member');
    expect(add.request.method).toBe('POST');
    expect(add.request.body).toEqual({ phone: '09120000000', roleId: 7 });
    add.flush({ userId: 2, phoneNumber: '09120000000', role: { id: 7, key: 'cashier', name: 'x' } });

    service.updateMemberRole(2, 8).subscribe();
    const update = http.expectOne('https://api.test/store-member/2');
    expect(update.request.method).toBe('PATCH');
    expect(update.request.body).toEqual({ roleId: 8 });
    update.flush({ userId: 2, phoneNumber: '09120000000', role: { id: 8, key: null, name: 'y' } });

    service.removeMember(2).subscribe();
    const remove = http.expectOne('https://api.test/store-member/2');
    expect(remove.request.method).toBe('DELETE');
    remove.flush({ success: true });

    expect(changes).toBe(3);
  });

  it('creates, edits and deletes roles', () => {
    service.createRole({ name: 'گارسون', permissions: ['sales.create'] }).subscribe();
    http
      .expectOne({ method: 'POST', url: 'https://api.test/store-role' })
      .flush({ id: 9, key: null, name: 'گارسون', permissions: ['sales.create'] });

    service.updateRole(9, { name: 'گارسون', permissions: [] }).subscribe();
    http
      .expectOne({ method: 'PATCH', url: 'https://api.test/store-role/9' })
      .flush({ id: 9, key: null, name: 'گارسون', permissions: [] });

    service.deleteRole(9).subscribe();
    http.expectOne({ method: 'DELETE', url: 'https://api.test/store-role/9' }).flush({ success: true });

    expect(changes).toBe(3);
  });
});
