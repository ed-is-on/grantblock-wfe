import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing.module';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule} from './material.module'
import { HighchartsChartModule } from 'highcharts-angular';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material';


// Components
import { AppComponent } from '../app/app.component';
import { HelloComponent } from '../app/hello.component';
import { GranteeComponent } from '../components/grantee/grantee.component';
import { GranteeTransactionsComponent } from '../components/grantee-transactions/grantee-transactions.component';
import { GranteeApprovalsComponent } from '../components/grantee-approvals/grantee-approvals.component';
import { GranteeChartComponent } from '../components/grantee-chart/grantee-chart.component'
import { MainNavComponent } from '../components/main-nav/main-nav.component'
import { PageTitleComponent } from '../components/page-title/page-title.component';
import { EducationComponent } from '../components/education/education.component';
import { EducationDashboardComponent } from '../components/education-dashboard/education-dashboard.component';
import { EducationAuditComponent } from '../components/education-audit/education-audit.component';
import { EducationFundComponent } from '../components/education-fund/education-fund.component';
import { EducationReviewComponent } from '../components/education-review/education-review.component';

// Dialogs
import { ApprovalDialogComponent } from '../components/dialogs/approval/approval.dialog.component';
import { TransactionDialogComponent } from '../components/dialogs/transaction/transaction.dialog.component';

// Services
import { GranteeService } from '../services/grantee.service';
import { TransactionsService } from '../services/transactions.service';
import { DataService } from '../hyperledger/data.service';
import { GrantBlockService } from '../services/grantblock.service';
import { AzureService } from '../services/azure.service';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, HttpModule, MaterialModule, HighchartsChartModule,MatFormFieldModule,MatSelectModule, MatRadioModule, MatButtonModule],
  declarations: [
    AppComponent,
    HelloComponent,
    GranteeComponent,
    GranteeTransactionsComponent,
    GranteeApprovalsComponent,
    ApprovalDialogComponent,
    TransactionDialogComponent,
    GranteeChartComponent,
    MainNavComponent,
    PageTitleComponent, 
    EducationComponent,
    EducationDashboardComponent,
    EducationAuditComponent,
    EducationFundComponent,
    EducationReviewComponent
  ],
  providers:[
    GranteeService,
    TransactionsService,
    DataService,
    GrantBlockService,
    AzureService
  ],
  entryComponents:[
    ApprovalDialogComponent,
    TransactionDialogComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
