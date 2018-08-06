import { Component } from '@angular/core';
import { Subscription }   from 'rxjs';
import { NgForm } from '@angular/forms';

import { NavChangeService } from './nav-change.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NavChangeService]
})
export class AppComponent {
  title = 'Sysplorer';
  subscription: Subscription;
  nav: string;
  searchBtnText: string;
  showSearch: boolean;

  constructor(
    private navChangeService: NavChangeService
  ) {
    this.showSearch = false;
    this.subscription = navChangeService.navChanged$.subscribe(
      navChange => {
        this.nav = navChange;

        switch(this.nav) {
          case 'app-offers':
            this.searchBtnText = "Find Offers";
            this.showSearch = true;
            break;
          case 'app-proposals':
            this.showSearch = false;
            break;
          case 'app-assets':
            this.searchBtnText = "Find Assets";
            this.showSearch = true;
            break;
          case 'app-aliases':
            this.searchBtnText = "Find Aliases";
            this.showSearch = true;
            break;
          default:
            this.showSearch = false;
        }
      }
    )
  }

  submitInput(data: NgForm) {
    this.navChangeService.executeSearch(data.value.searchStr);
  }
}
