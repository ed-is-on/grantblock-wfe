import { TransactionApprover } from './approver.model'
export class Transactions {

  transactionId: string;
  granteeId: string;
  granteeName: string;
  date: Date;
  amount: number;
  status?: string;
  type?: string;
  purpose?: string;
  location?: string;
  approvers?: TransactionApprover[];
  receiptHash?: string;
  receiptImage?: string;

  constructor(
    _granteeId: string,
    _name: string,
    _amount: number,
    _date?: Date,
    _purpose?: string,
    _location?: string,
    _status?: string,
    _type?: string,
    _transactionId?:string,
    _receiptHash?:string,
    _receiptImage?:string
  ) {
    this.granteeId = _granteeId;
    this.granteeName = _name;
    this.amount = parseInt(_amount.toString());
    this.location = _location || '';
    this.purpose = _purpose || '';
    this.transactionId = _transactionId || `${Math.floor(Math.random() * 2000) + 1}`;
    this.date = _date || new Date();
    this.status = _status;
    this.type = _type;
    this.receiptHash = _receiptHash || '';
    this.receiptImage = _receiptImage || '';
  }

  getDetails() {
    return this;
  }

  AddApprovers(_approvers: TransactionApprover[]) {
    this.approvers = _approvers;
  }

}