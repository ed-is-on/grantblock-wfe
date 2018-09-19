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
  borderClass: string;
  pageInfo = {Title: 'Audit Transactions', Description: 'Dept. of Education employees can review a selection of audited transactions.'} 

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
        //console.log(results);
        //Filter results for less than 1000
        function isBigEnough(element) { 
          return (element.amount <= -1000); 
       } 

       
       var leftOver = results.filter(isBigEnough);
       //console.log(leftOver);

        //Take every third completed transaction for audit
        var lng:number = leftOver.length;
        var ctn:number = lng / 3; 
        var adt: Array<any> = [];

        for (var _e=0; _e < ctn;_e++){
          var temp = leftOver[_e*3];
          adt.push(temp);
        }
      
        results = adt; //set adt = results
        //console.log(results);

        this.transactions = results.map((_trans)=>{
          this.$grantblockService.GetApproveActionRequestHistory(_trans.transactionId).then((x:any[])=>{
            _trans.approvalHistory = x.map((historianTransaction:any)=>{
             historianTransaction.approve = historianTransaction.approve === true ? 'Approved' : 'Rejected';
              return historianTransaction;
            });
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
