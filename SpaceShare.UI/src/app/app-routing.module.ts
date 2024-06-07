import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './landing/register/register.component';
import { LoginComponent } from './landing/login/login.component';
import { AgreementComponent } from './landing/agreement/agreement.component';
import { PropertyComponent } from './property/property.component';
import { VerificationComponent } from './landing/verification/verification.component';
import { ListingComponent } from './listing/listing.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { ProfileComponent } from './profile/profile.component';
import { SuccessComponent } from './success/success.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { TermsComponent } from './landing/agreement/terms/terms.component';
import { PrivacyComponent } from './landing/agreement/privacy/privacy.component';
import  { ResetPasswordComponent } from './landing/reset_password/reset-password.component';
import { ResetFormComponent } from './landing/reset_password/reset-form/reset-form.component';
import { SubscriptionComponent } from './subscription/subscription.component';


const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'agreement', component: AgreementComponent },
  { path: 'property/:id', component: PropertyComponent },
  { path: 'verification', component: VerificationComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'listing/add', component: AddListingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'agreement/terms', component: TermsComponent },
  { path: 'agreement/privacy', component: PrivacyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password/reset-form', component: ResetFormComponent },
  {path: 'subscription', component: SubscriptionComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
