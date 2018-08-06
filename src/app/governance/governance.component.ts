import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../api.service';
import { NavChangeService } from '../nav-change.service';

import { GovInfo } from '../models/govInfo';
import { Proposals } from '../models/proposals';
import { Triggers } from '../models/triggers';

@Component({
  selector: 'app-governance',
  templateUrl: './governance.component.html',
  styleUrls: ['./governance.component.css']
})
export class GovernanceComponent implements OnInit {

  govInfo: GovInfo;
  proposals: Proposals;
  triggers: Triggers;
  showProps: boolean;
  showTrigs: boolean;
  lastSuperblockTime: Promise<number>;
  nextSuperblockTime: string;
  averageBlockTime: number;
  nextSuperblockTimestamp: number;
  nextSuperblockBudget: number;

  nav: string;
  resPerPage: number;
  defaultResPerPage: number;
  pageNum: number;
  pageNums: number[] = [];
  totalResults: number;
  private routeSub: Subscription;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private navChangeService: NavChangeService
  ) {
    navChangeService.changeNav('app-governance');
  }

  async ngOnInit() {
    this.proposals = new Proposals;
    this.triggers = new Triggers;
    this.govInfo = new GovInfo;
    this.lastSuperblockTime = null;
    this.nextSuperblockTime = null;
    this.averageBlockTime = null;
    this.nextSuperblockBudget = 0;
    this.showProps = true;
    this.showTrigs = false;
    this.pageNum = 0;
    this.defaultResPerPage = 10;

    this.govInfo = await this.api.getGovInfo();
    this.lastSuperblockTime = this.api.getBlockTime(this.govInfo.lastsuperblock);
    this.nextSuperblockBudget
                = await this.api.getSuperblockBudget(this.govInfo.nextsuperblock);
    this.averageBlockTime = await this.api.getAverageBlockTime();
    this.estNextSuperblockTime();

    // get parameters from route each time it changes
    this.routeSub = this.route.paramMap.subscribe(
      params => {
        this.nav = params.get('nav');
        this.resPerPage = parseInt(params.get('resPerPage'));
        this.pageNum = parseInt(params.get('pageNum'));

        if (!(this.nav == null || isNaN(this.resPerPage) || isNaN(this.pageNum))) {
          this.init();
        }
      }
    );
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  async init() {
    this.proposals = await this.api.getProposals(this.resPerPage, this.pageNum);
    this.triggers = await this.api.getTriggers(this.resPerPage, this.pageNum);

    if (this.nav == 'proposals') {
      this.totalResults = this.proposals[0].count[0].count;
      this.showProposals();
    } else if (this.nav == 'triggers') {
      this.showTriggers();
      this.totalResults = this.triggers[0].count[0].count;
    }

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

  // function to estimate the next superblock time, based on the average block
  // time
  async estNextSuperblockTime() {
    var secsPerCycle = this.govInfo.superblockcycle * this.averageBlockTime;
    this.nextSuperblockTimestamp
                        = (await this.lastSuperblockTime + secsPerCycle) * 1000;
    this.nextSuperblockTime
                        = new Date(this.nextSuperblockTimestamp).toUTCString();
  }

  // function used by a UI button to show the proposals
  showProposals() {
    this.showProps = true;
    this.showTrigs = false;
  }

  // function used by a UI button to show the triggers
  showTriggers() {
    this.showTrigs = true;
    this.showProps = false;
  }
}
