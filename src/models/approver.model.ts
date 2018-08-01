export enum enumApprovalStatus{
  Approved,
  Rejected,
  Pending
}
export class TransactionApprover{
    approverId:string;
    approvalStatus:enumApprovalStatus = enumApprovalStatus.Pending;

    constructor(_approverId:string, _approvalStatus?:number){
      this.approverId = _approverId;
      this.approvalStatus = _approvalStatus === null || undefined ? 2 : _approvalStatus;
    }


    Approve(){
      this.approvalStatus = enumApprovalStatus.Approved;
    }

    Reject(){
      this.approvalStatus = enumApprovalStatus.Rejected;
    }

}