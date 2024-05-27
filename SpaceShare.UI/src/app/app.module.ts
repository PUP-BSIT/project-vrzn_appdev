import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './landing/register/register.component';
import { LoginComponent } from './landing/login/login.component';
import { RecoverComponent } from './landing/recover/recover.component';
import { AgreementComponent } from './landing/agreement/agreement.component';
import { CardComponent } from './card/card.component';
import { PropertyCardComponent } from './property-card/property-card.component';
import { PropertyComponent } from './property/property.component';
import { VerificationComponent } from './landing/verification/verification.component';
import { ListingComponent } from './listing/listing.component';
import { AddListingComponent } from './add-listing/add-listing.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    MainComponent,
    RegisterComponent,
    LoginComponent,
    RecoverComponent,
    AgreementComponent,
    CardComponent,
    PropertyCardComponent,
    PropertyComponent,
    VerificationComponent,
    ListingComponent,
    AddListingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
