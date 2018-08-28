import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

export interface reason {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'transaction-approval-dialog',
  templateUrl: './approval.dialog.component.html',
  styleUrls: ['./approval.dialog.component.css']
})
export class ApprovalDialogComponent implements OnInit {

  constructor(
    public thisDialog: MatDialogRef<ApprovalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  approveReject:string;
  transactionAmt : string ="$4753.10"
  defaultProfilePic: string ='assets/sample-receipt.jpg';
  showReceipt: string='Show Receipt';
  showReceiptVal: string='';
  comments: string='';
  reasonSelected: string='';


  ngOnInit() {
    this.approveReject='cancel';
  }

  CloseConfirm(){
    confirm("Are you sure?");
    this.thisDialog.close('Confirm');
  }

  CancelConfirm(){
    this.thisDialog.close('Cancel')
  }

  private _prevSelected: any;

  handleChange(evt) {
    if (evt==1) {
      this.approveReject='approve';
    } else {
      this.approveReject='reject';
    }
  }

  receiptChange(){
    if (this.showReceipt == 'Show Receipt') {
      this.showReceipt = 'Hide Receipt'
      this.showReceiptVal = 'yes';
    }
    else {
      this.showReceipt = 'Show Receipt';
      this.showReceiptVal = '';
    }

  }

  reasons: reason[] = [
    {value: '0', viewValue: 'Transaction Description does not match receipt description'},
    {value: '1', viewValue: 'Transaction Amount does not match receipt amount'},
    {value: '2', viewValue: 'Receipt is missing or unreadable'}
  ];

}