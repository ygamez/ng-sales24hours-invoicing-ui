import { DecimalPipe } from '@angular/common';
import { Injectable, PipeTransform, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { NgbdSortableHeader, SortDirection, SortEvent} from '../directive/sortable.directive';
import { AttributeType } from '../models/attributeType';

interface SearchResult {
  entities: any[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: string;
  sortDirection: SortDirection;
}

function compare(v1, v2) {
  return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

function sort(entities: any[], column: string, direction: string) {
  if (direction === '') {
    return entities;
  } else {
    return [...entities].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(entity: any, term: string, pipe: PipeTransform, attributeTypes: AttributeType[]) {
  term = term.toLowerCase();
  let matchs: boolean[] = [];
  if (attributeTypes.length > 0){
    for(let attr of attributeTypes){
      if (attr.type === 'string'){
        if (entity[attr.name] != undefined){
          matchs.push(entity[attr.name].toLowerCase().includes(term));
        }
      }
      if (attr.type === 'boolean'){
        if (entity[attr.name] != undefined){
          matchs.push(String(entity[attr.name]).toLowerCase().includes(term));
        }
      }
      if (attr.type === 'number'){
        if (entity[attr.name] != undefined){
          matchs.push(pipe.transform(entity[attr.name]).includes(term));
        }
      }
    }
    if (matchs.filter(x => x === true).length > 0)
      return true;
  }
  return false;
}

@Injectable({
  providedIn: 'root'
})
export class TableService {
  entities: any[] = [];
  totalItem: any;
  attributeTypes: AttributeType[];
  private _loading$ = new BehaviorSubject<boolean>(true);
  public _search$ = new Subject<void>();
  private _entities$ = new BehaviorSubject<any[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 10,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._entities$.next(result.entities);
      this._total$.next(result.total);
    });
    this._search$.next();
  }

  get entities$() { return this._entities$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: string) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
    // 1. sort
    let entities = sort(this.entities, sortColumn, sortDirection);

    // 2. filter
    if (this.attributeTypes.length > 0)
      entities = entities.filter(item => matches(item, searchTerm, this.pipe, this.attributeTypes));

    let total = entities.length;

    // 3. paginate
    entities = entities.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    return of({entities, total});
  }

  public setEntities(data){
    this.entities = data;
  }

  public setTotalItem(value){
    this.totalItem = value;
  }

  public setAttributesType(data: any[]){
    this.attributeTypes = data;
  }
}
