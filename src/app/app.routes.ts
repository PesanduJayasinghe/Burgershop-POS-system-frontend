import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BurgersComponent } from './components/card/burgers/burgers.component';
import { BeveragesComponent } from './components/card/beverages/beverages.component';
import { SweetsComponent } from './components/card/sweets/sweets.component';
import { CartComponent } from './components/cart/cart.component';
import { StatsComponent } from './pages/stats/stats.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'burgers', pathMatch: 'full' },
      { path: 'burgers', component: BurgersComponent },
      { path: 'beverages', component: BeveragesComponent },
      { path: 'sweets', component: SweetsComponent },
      { path: 'cart', component: CartComponent }
    ]
  },
  { path: 'stats', component: StatsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'profile', component: ProfileComponent }

];

