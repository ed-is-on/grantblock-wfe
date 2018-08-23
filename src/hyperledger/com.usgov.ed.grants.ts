import { Asset } from './org.hyperledger.composer.system';
import { Participant } from './org.hyperledger.composer.system';
import { Transaction } from './org.hyperledger.composer.system';
import { Event } from './org.hyperledger.composer.system';
// export namespace com.usgov.ed.grants{
export class Obligation {
    granteeId: string;
    allottedAmount: number;
}
export enum RequestStatus {
    INITIALIZED,
    VALIDATORS_SELECTED,
    VALIDATION_IN_PROGRESS,
    APPROVED,
    ADJUDICATED,
    REJECTED,
}
export abstract class User extends Participant {
    userId: string;
    pocName: string;
    pocEmail: string;
}
export class Education extends User {
}
export class Treasury extends User {
}
export class Grantee extends User {
    grantBalance: number;
}
export class ActionRequest extends Asset {
    requestId: string;
    status: RequestStatus;
    createdDate: string;
    requestValue: number;
    owner: Grantee;
    assignedValidators: Grantee[];
    approvedValidators: Grantee[];
    treasuryValidator: boolean;
    receiptImage: string;
}
export class SetUpDemo extends Transaction {
    grantBalance: number;
}
export class CreateGrantee extends Transaction {
    userId: string;
    grantBalance: number;
    pocName: string;
    pocEmail: string;
}
export class CreateEdUser extends Transaction {
    userId: string;
    pocName: string;
    pocEmail: string;
}
export class CreateTreasury extends Transaction {
    userId: string;
    pocName: string;
    pocEmail: string;
}
export class ImportGrantee extends Transaction {
    userId: string;
    grantBalance: number;
    pocName: string;
    pocEmail: string;
}
export class ObligateSlate extends Transaction {
    slate: Obligation[];
}
export class CreateActionRequest extends Transaction {
    requestValue: number;
    requestor: Grantee;
}
export class AddValidatingGrantees extends Transaction {
    validators: number;
    request: ActionRequest;
}
export class ApproveActionRequest extends Transaction {
    approve: boolean;
    approver: Grantee;
    request: ActionRequest;
}
export class VerifyActionRequest extends Transaction {
}
export class NotifyValidators extends Event {
    request: ActionRequest;
}
export class NotifyRequestFailure extends Event {
    request: ActionRequest;
}
export class NotifyRequestSuccess extends Event {
    request: ActionRequest;
}
export class NotifyDisbursement extends Event {
}
export class NotifyApprovers extends Event {
    req: ActionRequest;
    verifierid: string;
}
export class NotifyTreasury extends Event {
    req: ActionRequest;
}
export class ActionRequestMade extends Event {
    req: ActionRequest;
}
// }