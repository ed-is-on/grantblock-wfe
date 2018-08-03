import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module'
import { HighchartsChartModule } from 'highcharts-angular';

// Components
import { AppComponent } from '../app/app.component';
import { HelloComponent } from '../app/hello.component';
import { GranteeComponent } from '../components/grantee/grantee.component';
import { GranteeTransactionsComponent } from '../components/grantee-transactions/grantee-transactions.component';
import { GranteeApprovalsComponent } from '../components/grantee-approvals/grantee-approvals.component';
import { GranteeChartComponent } from '../components/grantee-chart/grantee-chart.component'
import { MainNavComponent } from '../components/main-nav/main-nav.component'

// Dialogs
import { ApprovalDialogComponent } from '../components/dialogs/approval/approval.dialog.component';
import { TransactionDialogComponent } from '../components/dialogs/transaction/transaction.dialog.component';

// Services
import { GranteeService } from '../services/grantee.service';
// import { TransactionsService } from '../services/transactions.service';

@NgModule({
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, FormsModule, MaterialModule, HighchartsChartModule],
  declarations: [
    AppComponent,
    HelloComponent,
    GranteeComponent,
    GranteeTransactionsComponent,
    GranteeApprovalsComponent,
    ApprovalDialogComponent,
    TransactionDialogComponent,
    GranteeChartComponent,
    MainNavComponent
  ],
  providers:[
    GranteeService
  ],
  entryComponents:[
    ApprovalDialogComponent,
    TransactionDialogComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
