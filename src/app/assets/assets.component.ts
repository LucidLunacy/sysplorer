import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../api.service';
import { NavChangeService } from '../nav-change.service';

import { Assets } from '../models/assets';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {

  assets: Assets;

  searchStr: string;
  resPerPage: number;
  defaultResPerPage: number;
  pageNum: number;
  pageNums: number[] = [];
  totalResults: number;

  private routeSub: Subscription;
  private searchSub: Subscription;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private navChangeService: NavChangeService
  ) {
    navChangeService.changeNav('app-assets');
  }

  ngOnInit() {
    this.assets = new Assets;
    this.defaultResPerPage = 10;

    // get parameters from route each time it changes
    this.routeSub = this.route.paramMap.subscribe(
      params => {
        this.searchStr = params.get('searchStr');
        this.resPerPage = parseInt(params.get('resPerPage'));
        this.pageNum = parseInt(params.get('pageNum'));

        if (!(this.searchStr == null || isNaN(this.resPerPage) || isNaN(this.pageNum))) {
          this.init();
        }
      }
    )

    this.searchSub = this.navChangeService.searchExecuted$.subscribe(
      searchStr => {
        this.search(searchStr);
      }
    )
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.searchSub.unsubscribe();
  }

  async init() {
    // find assets based on the search string
    this.assets = await this.api.findAssets(this.searchStr, this.resPerPage,
                                              this.pageNum);

    this.totalResults = this.assets[0].count[0].count;

    // calculate the number of pages for pagination
    var pages = this.totalResults / this.resPerPage;

    // initialise the page numbers to iterate over using ngFor
    this.pageNums = [];
    for (var i = 1; i < pages + 1; i++) {
      this.pageNums.push(i);
    }

    // scroll back to the top of the window
    window.scrollTo(0, 0);
  }

  search(searchStr) {
    if (isNaN(this.resPerPage)) {
      this.resPerPage = this.defaultResPerPage;
    }
    this.router.navigate([`assets/${searchStr}/${this.resPerPage}/1`])
  }

  private submitInput(data: NgForm) {
    if (isNaN(this.resPerPage)) {
      this.resPerPage = this.defaultResPerPage;
    }
    this.router.navigate([`assets/${data.value.searchStr}/${this.resPerPage}/1`])
  }
}
