import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GranteeComponent } from '../components/grantee/grantee.component'
import { GranteeChartComponent } from '../components/grantee-chart/grantee-chart.component';
import { GranteeTransactionsComponent } from '../components/grantee-transactions/grantee-transactions.component';


import { GranteeService } from '../services/grantee.service'

const routes: Routes = [
  {
    path: 'grantee',
    component: GranteeComponent
  },
  { path: 'education', component: GranteeChartComponent },
  { path: '', redirectTo: 'grantee', pathMatch: 'full' }
]

@NgModule({
  exports: [RouterModule],
  providers: [GranteeService],
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true
  })],
})
export class AppRoutingModule { }