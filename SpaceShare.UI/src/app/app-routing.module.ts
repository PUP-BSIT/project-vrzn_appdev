import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

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
import { ResetPasswordComponent } from './landing/reset_password/reset-password.component';
import { ResetFormComponent } from './landing/reset_password/reset-form/reset-form.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { CookieComponent } from './landing/agreement/cookie/cookie.component';
import { AboutComponent } from './landing/agreement/about/about.component';
import { PresskitComponent } from './landing/agreement/presskit/presskit.component';
import { RentingComponent } from './landing/agreement/renting/renting.component';
import { WentWrongComponent } from './went-wrong/went-wrong.component';
import { OwnedComponent } from './owned/owned.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MainComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'agreement', component: AgreementComponent },
  { path: 'space/owned', component: OwnedComponent },
  { path: 'space/:id', component: PropertyComponent },
  { path: 'verification', component: VerificationComponent },
  { path: 'listing', component: ListingComponent },
  { path: 'listing/add', component: AddListingComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'success', component: SuccessComponent },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'agreement/terms', component: TermsComponent },
  { path: 'agreement/privacy', component: PrivacyComponent },
  { path: 'agreement/cookie', component: CookieComponent},
  { path: 'agreement/about', component: AboutComponent},
  { path: 'agreement/presskit', component: PresskitComponent},
  { path: 'agreement/renting', component: RentingComponent},
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-password/reset-form', component: ResetFormComponent },
  { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: 'subscription', component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: '**', component: WentWrongComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
