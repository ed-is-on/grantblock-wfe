import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface Food {
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

  ngOnInit() {
    this.approveReject='approve';
  }

  CloseConfirm(){
    this.thisDialog.close('Confirm');
  }

  CancelConfirm(){
    this.thisDialog.close('Cancel')
  }

  private _prevSelected: any;

  handleChange(evt) {
    if (evt==1) {
      this.approveReject='approve'
    } else {
      this.approveReject='reject'
    }
  }

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

}