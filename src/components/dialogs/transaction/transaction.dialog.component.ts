import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Transactions } from '../../../models/transactions.model';
import { Grantee } from '../../../models/grantee.model';
import { DataService } from '../../../hyperledger/data.service';
import * as HyperLedgerClasses from '../../../hyperledger/com.usgov.ed.grants';
import { CreateActionRequest } from '../../../hyperledger/com.usgov.ed.grants';


@Component({
  selector: 'new-transaction-dialog',
  templateUrl: './transaction.dialog.component.html',
  styleUrls: ['./transaction.dialog.component.css']
})
export class TransactionDialogComponent implements OnInit {

  private namespace:string = 'CreateActionRequest';

  newTransactionData:{
    amount?:number,
    location?:string,
    purpose?:string,
    attachments?:any,
    grantee?: Grantee
  } = {}

  constructor(
    private $dataService: DataService<CreateActionRequest>,
    public thisDialog: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.newTransactionData.grantee = this.data.grantee;
  }

  ngOnInit() {
  }

  CloseConfirm(){
    const hyperledgerGrantee = new HyperLedgerClasses.Grantee();
    hyperledgerGrantee.userId = this.data.grantee.Id;
    const actionRequest = new HyperLedgerClasses.CreateActionRequest();
    actionRequest.requestor = hyperledgerGrantee;
    actionRequest.requestValue = this.newTransactionData.amount;
    this.$dataService.add(this.namespace, actionRequest).subscribe((results)=>{
      console.log('New Transaction Results',results);
    });
    
    // this.thisDialog.close({success:true, data:this.newTransactionData});
  }

  CancelConfirm(){
    this.thisDialog.close({success:false})
  }

  AllowSubmit(){
    let allowSubmit = false;
    if( this.newTransactionData.amount > this.data.availableBalance){
        allowSubmit = true;
    }
    return allowSubmit;
  }

}