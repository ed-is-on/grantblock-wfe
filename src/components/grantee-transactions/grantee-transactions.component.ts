import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Transactions } from '../../models/transactions.model';
import { TransactionApprover, enumApprovalStatus } from '../../models/approver.model';
import { TransactionsService } from '../../services/transactions.service';
import { TransactionDialogComponent } from '../dialogs/transaction/transaction.dialog.component';
import { Grantee } from '../../models/grantee.model';

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
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.GetTransactions();
  }

  UpdateAvailableBalance() {
    this.availableBalance = this.$transactions.GetGranteesAvailableBalance(this.selectedGrantee.Id, this.selectedGrantee.Amount, this.myTransactions);
  }

  GetTransactions() {
    this.myTransactions = this.$transactions.GetGranteesTransactions(this.selectedGrantee.Id).sort((x, y) => { return y.date.valueOf() - x.date.valueOf() });
    this.myTransactions.map((trans) => {
      trans.approvers = this.$transactions.SelectRandomApprovers(trans.granteeId);
    })
    // console.log('Getting money!', this.myTransactions);
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
      width: '600px',
      data: {
        grantee: this.selectedGrantee,
        availableBalance: this.availableBalance
      },
      disableClose: true,
      hasBackdrop: false,
      panelClass: 'grantblockModal'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Success!!', result)
      try {
        if (result) {
          const newTransaction = new Transactions(result.data.grantee.Id, result.data.grantee.Name, result.data.amount, new Date(), result.data.purpose || '', result.data.location || '');
          newTransaction.approvers = this.$transactions.SelectRandomApprovers(result.data.granteeId);
          this.myTransactions.push(newTransaction);
          this.UpdateAvailableBalance();
        }
      }
      catch (error) {
        console.log(error);
      }
    })
  }

}