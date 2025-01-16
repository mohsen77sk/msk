import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { MSK_APP_CONFIG } from '@msk/shared/utils/app-config';
import { MskPagingResponse, MskLookupResponse, MskPageData, EmptyPageData } from '@msk/shared/data-access';
import { DefaultPeopleSortDirection, DefaultPeopleSortId, Person } from './people.types';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private _appConfig = inject(MSK_APP_CONFIG);
  private _httpClient = inject(HttpClient);

  // Private
  private _persons: BehaviorSubject<MskPageData<Person>> = new BehaviorSubject<MskPageData<Person>>(EmptyPageData);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for persons
   */
  get persons$(): Observable<MskPageData<Person>> {
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
  ): Observable<MskPageData<Person>> {
    return this._httpClient
      .get<MskPagingResponse<Person>>(`${this._appConfig.apiEndpoint}/api/person/all`, {
        params: { page, pageSize, sortBy },
      })
      .pipe(
        map((response) => {
          return new MskPageData({
            ...response,
            items: response.items.map((item) => new Person(item)),
          });
        }),
        tap((response) => this._persons.next(response))
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
          const index = this._persons.value.items.findIndex((x) => x.id === newPerson.id) ?? 0;
          this._persons.value.items[index] = newPerson;
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
          const index = this._persons.value.items.findIndex((x) => x.id === newPerson.id) ?? 0;
          this._persons.value.items[index] = newPerson;
          this._persons.next(this._persons.value);
        }
      })
    );
  }
}
