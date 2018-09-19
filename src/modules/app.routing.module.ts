import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GranteeComponent } from '../components/grantee/grantee.component'
import { GranteeChartComponent } from '../components/grantee-chart/grantee-chart.component';
import { GranteeTransactionsComponent } from '../components/grantee-transactions/grantee-transactions.component';
import { EducationComponent } from '../components/education/education.component'

import { GranteeService } from '../services/grantee.service'
import { EducationDashboardComponent } from '../components/education-dashboard/education-dashboard.component';
import { EducationAuditComponent } from '../components/education-audit/education-audit.component';
import { EducationFundComponent } from '../components/education-fund/education-fund.component';
import { EducationReviewComponent } from '../components/education-review/education-review.component';

const educationChildRoutes: Routes = [
  { path: '', component: EducationDashboardComponent },
  { path: 'audit', component: EducationAuditComponent },
  { path: 'fund', component: EducationFundComponent },
  { path: 'review', component: EducationReviewComponent },
  { path: '**', pathMatch: 'full', redirectTo:'' },
]

const routes: Routes = [
  {
    path: 'grantee',
    component: GranteeComponent
  },
  { path: 'education', component: EducationComponent, children: educationChildRoutes },
  { path: '', redirectTo: 'grantee', pathMatch: 'full' }
]

@NgModule({
  exports: [RouterModule],
  providers: [GranteeService],
  imports: [RouterModule.forRoot(routes, {})],
})
export class AppRoutingModule { }