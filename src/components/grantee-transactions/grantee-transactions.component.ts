import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Transactions } from '../../models/transactions.model';
import { TransactionApprover, enumApprovalStatus } from '../../models/approver.model';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionDialogComponent } from '../dialogs/transaction/transaction.dialog.component';
import { Grantee } from '../../models/grantee.model';
import { GrantBlockService } from '../../services/grantblock.service';

@Component({
  selector: 'grantee-transactions',
  templateUrl: './grantee-transactions.component.html',
  styleUrls: ['./grantee-transactions.component.css', '../../app/app.component.css'],
  providers: [TransactionsService]
})
export class GranteeTransactionsComponent implements OnInit {
  availableBalance: number;
  selectedGrantee: Grantee;
  @Input() set UpdateSelectedGrantee(_grantee) {
    this.selectedGrantee = _grantee;
    this.GetTransactions();
    this.UpdateAvailableBalance();
  }

  myTransactions: Transactions[];
  allStatuses = enumApprovalStatus;
  constructor(
    private $transactions: TransactionsService,
    private $grantBlockService: GrantBlockService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.GetTransactions();
  }

  UpdateAvailableBalance() {
    this.$grantBlockService.GetGranteeAvailableBalance(this.selectedGrantee.Id)
      .then(
        (_availableBalance) => {
          this.availableBalance = _availableBalance;
        }).catch((_error) => {
          console.log(_error);
          this.availableBalance = this.$transactions.GetGranteesAvailableBalance(this.selectedGrantee.Id, this.selectedGrantee.Amount, this.myTransactions);
        })
  }

  GetTransactions() {
    this.$grantBlockService.GetGranteeTransactions(this.selectedGrantee.Id).subscribe((results) => {
      this.myTransactions = results.sort((a,b)=>{return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;});
    })
  }

  GetApprovalClass(_approval: TransactionApprover) {
    try {
      var classStatus = enumApprovalStatus[_approval.approvalStatus].toLowerCase();
      return classStatus || ''

    } catch (error) {
      console.error(error);
    }
  }

  NewTransaction(): void {

    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '500px',
      height: 'auto',
      closeOnNavigation: true,
      data: {
        grantee: this.selectedGrantee,
        availableBalance: this.availableBalance
      },
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Success!!', result)
      try {
        if (result.success) {
          // const newTransaction = new Transactions(result.data.results.requestor, result.data.newTransaction.grantee.Name, result.data.results.requestValue, new Date(), result.data.purpose || '', result.data.location || '');
          // // newTransaction.approvers = this.$transactions.SelectRandomApprovers(result.data.granteeId);
          // this.myTransactions.unshift(newTransaction);
          this.GetTransactions();
          this.UpdateAvailableBalance();
        }
      }
      catch (error) {
        console.log(error);
      }
    })
  }

}