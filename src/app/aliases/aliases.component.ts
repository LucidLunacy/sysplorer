import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../api.service';
import { NavChangeService } from '../nav-change.service';

import { Alias } from '../models/alias';
import { Aliases } from '../models/aliases';
import { AssetAlloc } from '../models/assetAlloc';
import { AssAllocInputs } from '../models/assAllocInputs';

@Component({
  selector: 'app-aliases',
  templateUrl: './aliases.component.html',
  styleUrls: ['./aliases.component.css']
})
export class AliasesComponent implements OnInit {

  aliases: Aliases;
  assetAllocs: AssetAlloc[][] = [];

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
    navChangeService.changeNav('app-aliases');
  }

  ngOnInit() {
    this.aliases = new Aliases;
    this.assetAllocs = new Array<AssetAlloc[]>();
    this.pageNum = 0;
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
    // find aliases based on the search string
    this.aliases = await this.api.findAliases(this.searchStr, this.resPerPage,
                                                this.pageNum);

    this.totalResults = this.aliases[0].count[0].count;

    // calculate the number of pages for pagination
    var pages = this.totalResults / this.resPerPage;

    // initialise the page numbers to iterate over using ngFor
    this.pageNums = [];
    for (var i = 1; i < pages + 1; i++) {
      this.pageNums.push(i);
    }

    // re-initialise the asset allocations arrays
    this.assetAllocs = new Array<AssetAlloc[]>();
    for (var i = 0; i < this.aliases[0].results.length; i++) {
      this.assetAllocs[i] = new Array<AssetAlloc>();
    }

    // scroll back to the top of the window
    window.scrollTo(0, 0);
  }

  // function to find the asset allocations of a specific alias
  async findAssetAllocs(index) {
    this.assetAllocs[index] = await this.api.listAssetAllocations(this.aliases[0].results[index].id);
  }

  private search(searchStr) {
    if (isNaN(this.resPerPage)) {
      this.resPerPage = this.defaultResPerPage;
    }
    this.router.navigate([`aliases/${searchStr}/${this.resPerPage}/1`])
  }

  private submitInput(data: NgForm) {
    if (isNaN(this.resPerPage)) {
      this.resPerPage = this.defaultResPerPage;
    }
    this.router.navigate([`aliases/${data.value.searchStr}/${this.resPerPage}/1`])
  }
}
