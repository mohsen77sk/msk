import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import {
  MskPagingResponse,
  MskLookupResponse,
  MskPageData,
  MskPagingRequest,
  MskChangeEvent,
} from '@msk/shared/data-access';
import { DefaultPeopleSortData, Person } from './people.types';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _changes = new Subject<MskChangeEvent<Person>>();

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stream of CRUD changes for in-place list updates
   */
  get changes$(): Observable<MskChangeEvent<Person>> {
    return this._changes.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get persons
   *
   * @param params
   */
  getPersons(
    params: MskPagingRequest = {
      page: 1,
      pageSize: 10,
      sortBy: `${DefaultPeopleSortData.active} ${DefaultPeopleSortData.direction}`,
    },
  ): Observable<MskPageData<Person>> {
    return this._httpClient
      .get<MskPagingResponse<Person>>(`${this._appConfig.apiEndpoint}/api/person/all`, { params })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Person(item)),
          });
        }),
      );
  }

  /**
   * Get lookup persons
   */
  getLookupPersons(): Observable<MskLookupResponse> {
    return this._httpClient
      .get<MskLookupResponse>(`${this._appConfig.apiEndpoint}/api/person/lookup`)
      .pipe(map((response) => response));
  }

  /**
   * Get person
   *
   * @param id
   */
  getPerson(id: number | string): Observable<Person> {
    return this._httpClient
      .get<Person>(`${this._appConfig.apiEndpoint}/api/person/${id}`)
      .pipe(map((response) => new Person(response)));
  }

  /**
   * Create person
   *
   * @param person
   */
  createPerson(person: Person): Observable<Person> {
    return this._httpClient.post<Person>(`${this._appConfig.apiEndpoint}/api/person`, person).pipe(
      map((response) => new Person(response)),
      tap((person) => this._changes.next({ type: 'create', item: person })),
    );
  }

  /**
   * Update person
   *
   * @param person
   */
  updatePerson(person: Person): Observable<Person> {
    return this._httpClient.put<Person>(`${this._appConfig.apiEndpoint}/api/person`, person).pipe(
      map((response) => new Person(response)),
      tap((person) => this._changes.next({ type: 'update', item: person })),
    );
  }

  /**
   * Update status of a person
   *
   * @param person
   */
  updatePersonStatus(person: Person): Observable<Person> {
    return this._httpClient.patch<Person>(`${this._appConfig.apiEndpoint}/api/person`, person).pipe(
      map((response) => new Person(response)),
      tap((person) => this._changes.next({ type: 'update', item: person })),
    );
  }
}
