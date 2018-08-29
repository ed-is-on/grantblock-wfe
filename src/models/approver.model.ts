export enum enumApprovalStatus{
  Approved,
  Rejected,
  Pending
}
export class TransactionApprover{
    approverId:string;
    transactionId:string;
    transactionDate: Date;
    transactionAmount: string;
    transactionStatus: string;
    transactionReceipt: string;
    approvalStatus:enumApprovalStatus = enumApprovalStatus.Pending;

    constructor(
      _approverId:string, 
      _transactionId: string,
      _transactionDate: Date,
      _transactionAmount: string,
      _approvalStatus?:number,
      _transactionStatus?: string,
      _transactionReceipt?: string
    ){
      this.approverId = _approverId;
      this.transactionId = _transactionId;
      this.transactionDate = _transactionDate;
      this.transactionAmount = _transactionAmount;
      this.transactionStatus = _transactionStatus;
      this.transactionReceipt = _transactionReceipt;
      this.approvalStatus = _approvalStatus === null || undefined ? 2 : _approvalStatus;
    }


    Approve(){
      this.approvalStatus = enumApprovalStatus.Approved;
    }

    Reject(){
      this.approvalStatus = enumApprovalStatus.Rejected;
    }

}