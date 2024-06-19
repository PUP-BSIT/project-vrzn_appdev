import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes, Router } from '@angular/router'; 
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './landing/register/register.component';
import { LoginComponent } from './landing/login/login.component';
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
import { NavbarComponent } from './landing/navbar/navbar.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { CarouselComponent } from './property/carousel/carousel.component';
import { FeaturesComponent } from './property/features/features.component';
import { InfoComponent } from './property/info/info.component';
import { DealComponent } from './property/info/deal/deal.component';
import { HostComponent } from './property/features/host/host.component';
import { TermsComponent } from './landing/agreement/terms/terms.component';
import { PrivacyComponent } from './landing/agreement/privacy/privacy.component';
import  { ResetPasswordComponent } from './landing/reset_password/reset-password.component';
import { ResetFormComponent } from './landing/reset_password/reset-form/reset-form.component';

import { LoginService } from './landing/login/login.service';
import { CookieService } from 'ngx-cookie-service';
import { NavbarService } from './landing/navbar/navbar.service';
import { LocationService } from './landing/register/location.service';
import { CookieComponent } from './landing/agreement/cookie/cookie.component';
import { AboutComponent } from './landing/agreement/about/about.component';
import { PresskitComponent } from './landing/agreement/presskit/presskit.component';
import { RentingComponent } from './landing/agreement/renting/renting.component';
import { RegisterService } from './landing/register/register.service';
import { AddListingService } from './add-listing/add-listing.service';
import { MainService } from './main/main.service';
import { PropertyService } from './property/property.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    MainComponent,
    RegisterComponent,
    LoginComponent,
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
    WishlistComponent,
    CarouselComponent,
    FeaturesComponent,
    InfoComponent,
    DealComponent,
    HostComponent,
    TermsComponent,
    PrivacyComponent,
    NavbarComponent,
    ResetPasswordComponent,
    ResetFormComponent,
    CookieComponent,
    AboutComponent,
    PresskitComponent,
    RentingComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
  ],
  providers: [
    LoginService, 
    CookieService, 
    NavbarService, 
    LocationService, 
    {
      provide: AuthService,
      useFactory: (cookieService: CookieService) => 
          new AuthService(cookieService),
      deps: [CookieService]
    }, 
    {
      provide: AuthGuard,
      useFactory: (authService: AuthService, router: Router) => 
          new AuthGuard(authService, router),
      deps: [AuthService, Router]
    },
    RegisterService,
    AddListingService,
    MainService,
    PropertyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
