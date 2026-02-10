import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BurgersComponent } from './components/card/burgers/burgers.component';
import { BeveragesComponent } from './components/card/beverages/beverages.component';
import { SweetsComponent } from './components/card/sweets/sweets.component';


export const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'burgers', pathMatch: 'full' },
      { path: 'burgers', component: BurgersComponent },
      { path: 'beverages', component: BeveragesComponent },
      { path: 'sweets', component: SweetsComponent }
    ]
  }
];

