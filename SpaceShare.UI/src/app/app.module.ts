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
import { PropertyCardComponent } from './property_card/property-card.component';
import { PropertyComponent } from './property/property.component';
import { VerificationComponent } from './landing/verification/verification.component';
import { ListingComponent } from './listing/listing.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { ProfileComponent } from './profile/profile.component';
import { SuccessComponent } from './success/success.component';
import { FooterComponent } from './footer/footer.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './landing/navbar/navbar.component';
import { ResetPasswordComponent } from './landing/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    MainComponent,
    RegisterComponent,
    LoginComponent,
    RecoverComponent,
    AgreementComponent,
    PropertyCardComponent,
    PropertyComponent,
    VerificationComponent,
    ListingComponent,
    AddListingComponent,
    ProfileComponent,
    SuccessComponent,
    FooterComponent,
    SubscriptionComponent,
    NavbarComponent,
    ResetPasswordComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
