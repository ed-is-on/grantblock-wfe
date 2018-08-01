import { TransactionApprover } from './approver.model'
export class Transactions {

  transactionId: number;
  granteeId: string;
  granteeName: string;
  date: Date;
  amount: number;
  purpose?: string;
  location?: string;
  approvers?:TransactionApprover[]

  constructor(
    _id:string,
    _name:string,
    _amount:number,
    _date?:Date,
    _purpose?:string,
    _location?:string
  ) {
    this.granteeId = _id;
    this.granteeName = _name;
    this.amount = parseInt(_amount.toString());
    this.location = _location || '';
    this.purpose = _purpose || '';
    this.transactionId = Math.floor(Math.random()*2000)+1;
    this.date = _date || new Date();
  }

  getDetails(){
    return this;
  }

  AddApprovers(_approvers:TransactionApprover[]){
    this.approvers = _approvers;
  }

}