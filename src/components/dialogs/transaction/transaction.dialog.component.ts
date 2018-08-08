import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { Transactions } from '../../../models/transactions.model';
import { Grantee } from '../../../models/grantee.model';

@Component({
  selector: 'new-transaction-dialog',
  templateUrl: './transaction.dialog.component.html',
  styleUrls: ['./transaction.dialog.component.css']
})
export class TransactionDialogComponent implements OnInit {

  newTransactionData:{
    amount?:number,
    location?:string,
    purpose?:string,
    attachments?:any,
    grantee?: Grantee
  } = {}

  constructor(
    public thisDialog: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { 
    this.newTransactionData.grantee = this.data.grantee;
  }

  ngOnInit() {
  }

  CloseConfirm(){
    this.thisDialog.close({success:true, data:this.newTransactionData});
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