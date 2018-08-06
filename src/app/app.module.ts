import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { ApiService } from './api.service';
import { AppRoutingModule } from './app-routing.module';

import { AliasesComponent } from './aliases/aliases.component';
import { AppComponent } from './app.component';
import { AssetsComponent } from './assets/assets.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GovernanceComponent } from './governance/governance.component';
import { OffersComponent } from './offers/offers.component';


@NgModule({
  declarations: [
    AppComponent,
    GovernanceComponent,
    AliasesComponent,
    AssetsComponent,
    NotFoundComponent,
    OffersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    ApiService,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
