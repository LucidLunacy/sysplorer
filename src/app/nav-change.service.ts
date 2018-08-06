import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable()
export class NavChangeService {

  private navChangeSource = new Subject<string>();
  private searchSource = new Subject<string>();

  navChanged$ = this.navChangeSource.asObservable();
  searchExecuted$ = this.searchSource.asObservable();

  constructor() { }

  changeNav(component: string) {
    this.navChangeSource.next(component);
  }

  executeSearch(searchStr: string) {
    this.searchSource.next(searchStr);
  }
}
