import { Component, OnInit, Input } from '@angular/core';
import {MatDialog} from '@angular/material';
import { ApprovalDialogComponent } from '../dialogs/approval/approval.dialog.component';
import { GrantBlockService } from '../../services/grantblock.service';
import { Transactions } from '../../models/transactions.model';

@Component({
  selector: 'grantee-approvals',
  templateUrl: './grantee-approvals.component.html',
  styleUrls: ['./grantee-approvals.component.css', '../../app/app.component.css']
})
export class GranteeApprovalsComponent implements OnInit {

  constructor(
    public dialog : MatDialog,
    public $grantblockService : GrantBlockService
  ) { }

  granteeId: string;
  myApprovals: Transactions[];
  @Input() set SetGranteeId(_granteeId:string){
    this.granteeId = _granteeId;
    console.log(this.granteeId);
    if(this.granteeId){
      this.$grantblockService.GetGranteeApprovals(this.granteeId).subscribe((_myApprovals)=>{
        this.myApprovals = _myApprovals;
        console.log(this.myApprovals);
      })
    }
  };

  ngOnInit() {

  }

  openDialog(): void {
   
    const dialogRef = this.dialog.open(ApprovalDialogComponent,{
      closeOnNavigation: true,
      disableClose: true,
      hasBackdrop:true
    });

    dialogRef.afterClosed().subscribe(result=>{
      console.log('Success!!', result)
    })
  }

}