import { Component, OnInit } from '@angular/core';
import { GrantBlockService } from '../../services/grantblock.service';
import { Transactions } from '../../models/transactions.model';
import { enumApprovalStatus } from '../../models/approver.model';

@Component({
  selector: 'education-audit',
  templateUrl: './education-audit.component.html',
  styleUrls: ['./education-audit.component.css']
})
export class EducationAuditComponent implements OnInit {

  private auditQuery = `{"where":{"and":[{"type":"DRAWDOWN"},{"or":[{"status":"APPROVED"},{"status":"REJECTED"}]}]}}`;
  transactions:Transactions[];

  constructor(
    private $grantblockService : GrantBlockService
  ) { }

  ngOnInit() {
    this.GetTransactionsToAudit();
  }

  ToggleDetails(_id){
    document.getElementById(_id).hidden = !document.getElementById(_id).hidden;
  }

  ShowImage(_transaction:Transactions):string{
    return `https://edhyperledger.blob.core.windows.net/receipts/${_transaction.receiptImage}`
  }

  GetApprovalStatus(_status:number){
    return enumApprovalStatus[_status]
  }

  GetTransactionsToAudit(){
    this.$grantblockService.GetTransactionHistory(this.auditQuery).then(
      (results)=>{
        this.transactions = results;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

}
