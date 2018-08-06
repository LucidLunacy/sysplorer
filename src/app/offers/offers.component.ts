import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { ApiService } from '../api.service';
import { NavChangeService } from '../nav-change.service';

import { Category } from '../models/category';
import { Offer } from '../models/offer';
import { Offers } from '../models/offers';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  offers: Offers;
  searchStr: string;
  resPerPage: number;
  defaultResPerPage: number;
  pageNum: number;
  pageNums: number[] = [];
  totalResults: number;
  nav: string;
  cats: Category[];
  mainMenuCats: Category[];
  subCats: Category[];
  selectedCat: Category;
  catParents: string[];
  private routeSub: Subscription;
  private searchSub: Subscription;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private navChangeService: NavChangeService
  ) {
    navChangeService.changeNav('app-offers');
  }

  ngOnInit() {
    this.offers = new Offers;
    this.pageNums = new Array<number>();
    this.pageNum = 1;
    this.defaultResPerPage = 10;
    this.catParents = new Array<string>();

    // get parameters from route each time it changes
    this.routeSub = this.route.paramMap.subscribe(
      async(params) => {
        // get the categories and add specific categories to the main menu
        this.cats = await this.api.getCategories();
        this.setMainMenuCats();

        this.resPerPage = parseInt(params.get('resPerPage'));
        this.pageNum = parseInt(params.get('pageNum'));
        this.nav = params.get('nav');

        if (isNaN(this.resPerPage)) {
          this.resPerPage = this.defaultResPerPage;
        }

        this.searchStr = params.get('searchStr');

        if (this.nav == 'category') {
          for (var i = 0; i < this.cats.length; i++) {
            if (this.cats[i].name == this.searchStr) {
              this.selectedCat = this.cats[i];
              this.catParents = this.findAllCatParents(this.selectedCat.name, new Array<string>());
            }
          }
        }

        if (!(this.nav == null || this.searchStr == null
          || isNaN(this.resPerPage) || isNaN(this.pageNum))) {
            this.getOffers();
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

  // function to add each category with no parent to the main menu categories
  setMainMenuCats() {
    this.mainMenuCats = [];
    this.cats.forEach(cat => {
      if (cat.parent == null) {
        this.mainMenuCats.push(cat);
      }
    });
  }

  // function to call send the relevant request to the api depending on whether
  // the user is searching or browsing through categories
  async getOffers() {
    this.offers = new Offers;

    if (this.nav == 'category') {
      this.offers = await this.api.categorisedOffers(this.selectedCat.name, this.resPerPage,
                                                      this.pageNum);
      this.setSubCats(this.selectedCat.name);
    } else if (this.nav == 'search') {
      this.offers = await this.api.findOffers(this.searchStr, this.resPerPage,
                                                this.pageNum);
    }

    this.totalResults = this.offers[0].count[0].count;

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

  // find all the parents of a category and return in an array
  findAllCatParents(catName, catParentArr): string[] {
    var category = null;
    this.cats.forEach(cat => {
      if (cat.name == catName) {
        category = cat;
      }
    });

    if (category !== null) {
      if (category.parent !== null) {
        this.findAllCatParents(category.parent, catParentArr);
        catParentArr.push(category.parent);
        return catParentArr;
      } else {
        return catParentArr;
      }
    }
  }

  // function to set the sub-categories depending on the given category name
  setSubCats(catName) {
    this.subCats = [];
    this.cats.forEach(cat => {
      if (cat.parent == catName) {
        this.subCats.push(cat);
      }
    });
  }

  search(searchStr) {
    this.subCats = [];
    this.catParents = null;

    if (isNaN(this.resPerPage)) {
      this.resPerPage = this.defaultResPerPage;
    }
    this.router.navigate([`offers/search/${searchStr}/${this.resPerPage}/1`])
  }
}
