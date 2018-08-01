import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

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

  ngOnInit() {
  }

  CloseConfirm(){
    this.thisDialog.close('Confirm');
  }

  CancelConfirm(){
    this.thisDialog.close('Cancel')
  }

}