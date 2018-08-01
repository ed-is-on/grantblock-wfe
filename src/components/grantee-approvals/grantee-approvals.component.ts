import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ApprovalDialogComponent } from '../dialogs/approval/approval.dialog.component';

@Component({
  selector: 'grantee-approvals',
  templateUrl: './grantee-approvals.component.html',
  styleUrls: ['./grantee-approvals.component.css', '../../app/app.component.css']
})
export class GranteeApprovalsComponent implements OnInit {

  constructor(
    public dialog : MatDialog
  ) { }

  ngOnInit() {
  }

  openDialog(): void {
   
    const dialogRef = this.dialog.open(ApprovalDialogComponent,{
      hasBackdrop:true
    });

    dialogRef.afterClosed().subscribe(result=>{
      console.log('Success!!', result)
    })
  }

}