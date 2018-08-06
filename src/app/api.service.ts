import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';

import { Aliases } from './models/aliases';
import { Assets } from './models/assets';
import { AssetAlloc } from './models/assetAlloc';
import { Category } from './models/category';
import { GovInfo } from './models/govInfo';
import { Offers } from './models/offers';
import { Proposals } from './models/proposals';
import { Triggers } from './models/triggers';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getProposals(resPerPage, pageNum): Promise<Proposals> {
    return this.http.get<Proposals>(`api/proposals/${resPerPage}/${pageNum}`)
      .toPromise();
  }

  getTriggers(resPerPage, pageNum): Promise<Triggers> {
    return this.http.get<Triggers>(`api/triggers/${resPerPage}/${pageNum}`)
      .toPromise();
  }

  getGovInfo(): Promise<GovInfo> {
    return this.http.get<GovInfo>('api/govinfo')
      .toPromise();
  }

  getAverageBlockTime(): Promise<number> {
    return this.http.get<number>('api/averageblocktime')
      .toPromise();
  }

  getBlockTime(bnumber): Promise<number> {
    return this.http.get<number>(`api/blocktime/${bnumber}`)
      .toPromise();
  }

  getSuperblockBudget(bnumber): Promise<number> {
    return this.http.get<number>(`api/superblockbudget/${bnumber}`)
      .toPromise();
  }

  getBlockHash(bnumber): Promise<string> {
    return this.http.get<string>(`api/blockhash/${bnumber}`)
      .toPromise();
  }

  findAliases(searchStr, resPerPage, pageNum): Promise<Aliases> {
    return this.http.get<Aliases>(`api/findaliases/${searchStr}/${resPerPage}/${pageNum}`)
      .toPromise();
  }

  listAssetAllocations(alias): Promise<AssetAlloc[]> {
    return this.http.get<AssetAlloc[]>(`api/listassetallocations/${alias}`)
      .toPromise();
  }

  findAssets(searchStr, resPerPage, pageNum): Promise<Assets> {
    return this.http.get<Assets>(`api/findassets/${searchStr}/${resPerPage}/${pageNum}`)
      .toPromise();
  }

  findOffers(searchStr, resPerPage, pageNum): Promise<Offers> {
    return this.http.get<Offers>(`api/findoffers/${searchStr}/${resPerPage}/${pageNum}`)
      .toPromise();
  }

  categorisedOffers(category, resPerPage, pageNum): Promise<Offers> {
    return this.http.get<Offers>(`api/categorisedoffers/${category}/${resPerPage}/${pageNum}`)
      .toPromise();
  }

  getCategories(): Promise<Category[]> {
    return this.http.get<Category[]>('api/categories')
      .toPromise();
  }
}
