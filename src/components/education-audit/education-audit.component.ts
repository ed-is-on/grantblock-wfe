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

  private auditQuery = `{"where":{"and":[{"type":"DRAWDOWN"},{"or":[{"status":"APPROVED"},{"status":"REJECTED"},{"status":"VALIDATION_IN_PROGRESS"}]}]}}`;
  transactions:Transactions[];
  borderClass: string;

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
        this.transactions = results.map((_trans)=>{
          this.$grantblockService.GetApproveActionRequestHistory(_trans.transactionId).then((x)=>{
            _trans.approvalHistory = x;
          }, (_error)=>{
            console.log(_error);
          })
          return _trans;
        });
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  GetBorderClass(_status){
    if(_status === 'Rejected'){
      this.borderClass = 'rejectedTransaction';
    }else if(_status === 'Validation In Progress'){
      this.borderClass = 'approvedTransaction';
    }
  }

}
