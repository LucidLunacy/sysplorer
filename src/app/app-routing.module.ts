import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

import { ApiService } from './api.service';

import { AliasesComponent } from './aliases/aliases.component';
import { AssetsComponent } from './assets/assets.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OffersComponent } from './offers/offers.component';
import { GovernanceComponent } from './governance/governance.component';

// define the routes in the app
const routes: Routes = [
  { path: '', redirectTo: '/offers', pathMatch: 'full' },
  { path: 'governance', component: GovernanceComponent, runGuardsAndResolvers: 'always'},
  { path: 'governance/:nav/:resPerPage/:pageNum', component: GovernanceComponent, runGuardsAndResolvers: 'always'},
  { path: 'aliases', component: AliasesComponent },
  { path: 'aliases/:searchStr/:resPerPage/:pageNum', component: AliasesComponent, runGuardsAndResolvers: 'always'},
  { path: 'assets', component: AssetsComponent },
  { path: 'assets/:searchStr/:resPerPage/:pageNum', component: AssetsComponent, runGuardsAndResolvers: 'always'},
  { path: 'offers', component: OffersComponent },
  { path: 'offers/:nav/:searchStr/:resPerPage/:pageNum', component: OffersComponent, runGuardsAndResolvers: 'always'},
  { path: '404', component: NotFoundComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})
  ],
  declarations: [],
  exports: [
    RouterModule
  ],
  providers: [
    ApiService
  ]
})
export class AppRoutingModule { }
