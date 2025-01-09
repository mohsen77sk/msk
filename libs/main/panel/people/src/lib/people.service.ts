import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskPagingResponse, MskPagination, MskLookupResponse } from '@msk/shared/data-access';
import { DefaultPeopleSortDirection, DefaultPeopleSortId, Person } from './people.types';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _pagination: BehaviorSubject<MskPagination | null> = new BehaviorSubject<MskPagination | null>(null);
  private _persons: BehaviorSubject<Person[] | null> = new BehaviorSubject<Person[] | null>(null);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for pagination
   */
  get pagination$(): Observable<MskPagination | null> {
    return this._pagination.asObservable();
  }

  /**
   * Getter for persons
   */
  get persons$(): Observable<Person[] | null> {
    return this._persons.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get persons
   *
   * @param page
   * @param pageSize
   * @param sortBy
   */
  getPersons(
    page = 1,
    pageSize = 10,
    sortBy = `${DefaultPeopleSortId} ${DefaultPeopleSortDirection}`
  ): Observable<{ pagination: MskPagination; items: Person[] }> {
    return this._httpClient
      .get<MskPagingResponse<Person>>(`${this._appConfig.apiEndpoint}/api/person/all`, {
        params: { page, pageSize, sortBy },
      })
      .pipe(
        map((response) => ({
          pagination: new MskPagination(response),
          items: response.items.map((row) => new Person(row)),
        })),
        tap((response) => {
          this._pagination.next(response.pagination);
          this._persons.next(response.items);
        })
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
    return this._httpClient
      .post<Person>(`${this._appConfig.apiEndpoint}/api/person`, person)
      .pipe(map((response) => new Person(response)));
  }

  /**
   * Update person
   *
   * @param person
   */
  updatePerson(person: Person): Observable<Person> {
    return this._httpClient.put<Person>(`${this._appConfig.apiEndpoint}/api/person`, person).pipe(
      map((response) => new Person(response)),
      // Update the persons
      tap((newPerson) => {
        if (this._persons.value) {
          const index = this._persons.value.findIndex((x) => x.id === newPerson.id) ?? 0;
          this._persons.value[index] = newPerson;
          this._persons.next(this._persons.value);
        }
      })
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
      // Update the persons
      tap((newPerson) => {
        if (this._persons.value) {
          const index = this._persons.value.findIndex((x) => x.id === newPerson.id) ?? 0;
          this._persons.value[index] = newPerson;
          this._persons.next(this._persons.value);
        }
      })
    );
  }
}
