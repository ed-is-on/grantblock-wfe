import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Transactions } from '../../models/transactions.model';
import { GrantBlockService } from '../../services/grantblock.service';

@Component({
  selector: 'education-review',
  templateUrl: './education-review.component.html',
  styleUrls: ['./education-review.component.css','../../app/app.component.css']
})
export class EducationReviewComponent implements OnInit {

  blockchain: Transactions[];
  errorMessage: string;

  matTableDataSource: MatTableDataSource<Transactions> = new MatTableDataSource<Transactions>();
  displayedColumns: string[] = [ 'granteeId', 'date', 'amount', 'type', 'status', 'approvers'];

  constructor(
    private $grantblockService: GrantBlockService
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  ngOnInit() {
    this.GetTransactions();
  }

  applyFilter(filterValue:string){
    this.matTableDataSource.filter = filterValue.trim().toLowerCase();
  }

  GetTransactions() {
    this.$grantblockService.GetTransactionHistory().then((results) => {
      this.blockchain = results.sort((a, b) => { return a.date > b.date ? -1 : a.date < b.date ? 1 : 0; });
      this.matTableDataSource.data = this.blockchain;
      this.matTableDataSource.paginator = this.paginator;
      this.matTableDataSource.sort = this.sort;
    }, (error) => {
      this.blockchain = undefined;
      this.errorMessage = error.message;
    })
  }

}
