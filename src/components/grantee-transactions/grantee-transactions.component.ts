import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
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

  /** This property emits an event whenever a new transaction has successfully been created */
  @Output() updatedTransactions = new EventEmitter<void>();

  myTransactions: Transactions[];
  matTableDataSource: MatTableDataSource<Transactions> = new MatTableDataSource<Transactions>();
  allStatuses = enumApprovalStatus;
  displayedColumns: string[] = ['date', 'amount', 'approvers', 'type', 'status']
  constructor(
    private $transactions: TransactionsService,
    private $grantBlockService: GrantBlockService,
    public dialog: MatDialog
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
      this.myTransactions = results.sort((a, b) => { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; });
      this.matTableDataSource.data = this.myTransactions;
      this.matTableDataSource.paginator = this.paginator;
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
      width: 'auto',
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
      try {
        if (result.success) {
          this.$grantBlockService.AddValidatingGrantees(result.data.results.requestId).subscribe(
            (_results) => {
              console.log('Transaction Approvers',_results);
              this.GetTransactions()
              this.UpdateAvailableBalance();
              this.updatedTransactions.emit();
            },
            () => {

            },
            () => {

            }
          )
        }
      }
      catch (error) {
        console.log(error);
      }
    })
  }



}