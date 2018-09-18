import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GrantBlockNameSpaces } from '../models/namespaces.enum';
import { Grantee } from '../models/grantee.model';
import { of } from '../../node_modules/rxjs';  
import {Observable} from 'rxjs/Rx'    
import { Transactions } from '../models/transactions.model';
import { GranteeService } from './grantee.service';
import { TransactionsService } from './transactions.service';
import { TransactionApprover, enumApprovalStatus } from '../models/approver.model';

enum HyperledgerClass{
    ApproveActionRequest,
    ActionRequest
}


@Injectable()
export class GrantBlockService {

    private apiUrl: string;
    private granteePattern: RegExp = /Grantee\#(g.*)$/;
    private namespacePrefix = 'com.usgov.ed.grants';

    constructor(
        private $http: Http,
        private $granteeService: GranteeService,
        private $transactions: TransactionsService
    ) {
        this.apiUrl = 'http://edhyperledger.eastus2.cloudapp.azure.com:3000/api/';
    }

    private GetGrantBlockOwnerId(_granteeId: string): string {
        return `resource%3Acom.usgov.ed.grants.Grantee%23${_granteeId}`;
    }

    private FormatResourceRelationship(_class:HyperledgerClass,_id:string):string{
        // console.log(HyperledgerClass[_class],_id);
        // console.log(encodeURI(`resource:com.usgov.ed.grants.${HyperledgerClass[_class]}#${_id}`))
        return encodeURI(`resource:com.usgov.ed.grants.${HyperledgerClass[_class]}#${_id}`);
    }

    private ConvertToProperCase(str): string {
        return str.toLowerCase().split(/[\s]+|[$_]/).map((word) => {
            return `${word.charAt(0).toUpperCase()}${word.slice(1)}`
        }).join(' ');
    }
    /**
     * This functions parses all the transactions returned from the REST call into instances of the Transaction class
     * @param response http response object containing transactions
     */
    private parseTransactions(response): any {
        /** A pointer to the service's ConvertToProperCase() function */
        let transactions = response.json().map((_value) => {
            let ownerId = decodeURIComponent(_value.owner).match(/Grantee\#(g.*)$/)[1];
            _value.type = this.ConvertToProperCase(_value.type);
            _value.status = this.ConvertToProperCase(_value.status);
            let transaction = new Transactions(ownerId, '', _value.requestValue, new Date(_value.createdDate), _value.purpose || '', null, _value.status, _value.type, _value.requestId,  _value.receiptHash || '', _value.receiptImage || '');
            if (_value.assignedValidators && _value.assignedValidators.length > 0) {
                let transactionApprovers: TransactionApprover[] = [];
                _value.assignedValidators.forEach((_approver) => {
                    let approvalStatus:enumApprovalStatus = enumApprovalStatus.Pending;
                    if(_value.status.toLowerCase() !== "rejected"){
                        if(_value.approvedValidators && _value.approvedValidators.length > 0 && _value.approvedValidators.map(x=>{return x.userId}).indexOf(_approver.userId)>-1){
                            approvalStatus = enumApprovalStatus.Approved;
                        } else if (_value.rejectValidators && _value.rejectValidators.length > 0 && _value.rejectValidators.map(x=>{return x.userId}).indexOf(_approver.userId)>-1){
                            approvalStatus = enumApprovalStatus.Rejected;
                        }
                    }
                    
                    transactionApprovers.push(new TransactionApprover(_approver.userId, _value.requestId, transaction.date, transaction.amount.toString(), approvalStatus, transaction.status, transaction.receiptImage, transaction.receiptHash, transaction.purpose))
                });

                transaction.AddApprovers(transactionApprovers);
            }
            return transaction;
        });
        return transactions;

    }
    /**
     * This functions parses all the transaction approvers returned from the REST call into instances of the Transaction class
     * @param response http response object containing transactions
     */
    private parseTransactionApprovers(response): any {
        /** A pointer to the service's ConvertToProperCase() function */
        let approvers = response.json().map((_value) => {
            let ownerId = decodeURIComponent(_value.owner).match(/Grantee\#(g.*)$/)[1];
            let approver = new TransactionApprover(ownerId, _value.requestId, new Date(_value.createdDate), _value.requestValue);
            return approver;
        });
        return approvers;
    }

    GetAllGrantees(): Observable<Grantee[]> {
        return this.$http.get(this.apiUrl + 'Grantee').map((results) => {
            return results.json().map((_value) => {
                return _value = new Grantee(_value.pocName, _value.grantBalance, _value.userId, _value.pocEmail);
            });
        })
            .catch((error) => {
                console.log('Error Accessing Blockchain', error);
                return of(this.$granteeService.GetAllGrantees().sort((x, y) => { if (x.Name < y.Name) { return -1; } else { return 1; } }));
            });
    }

    GetAllTransactions(): Observable<any> {
        return this.$http.get(`${this.apiUrl}ActionRequest`)
                .map(this.parseTransactions, this);
    }

    /** Get The total Award amount for All Recipients; this is for the Education/Fund Chart 
     * question:  how to return multiple values (ie, an array AND total amt)
    */
   //note, when testing on hyperledger composer, use a filter of:  {"where":{"type":"DRAWDOWN"}}
    GetDrawdowns(): Observable<any> {
        return this.$http.get(`${this.apiUrl}ActionRequest?filter=%7B%22where%22%3A%7B%22type%22%3A%22DRAWDOWN%22%7D%7D`)
            .map((xresults) => {
                return xresults.json()
                .map((_value) => {
                    const granteeId = decodeURIComponent(_value.owner).match(this.granteePattern)[1];
                    const newTransaction = new Transactions(granteeId, '', _value.requestValue, new Date(_value.createdDate), '', '', this.ConvertToProperCase(_value.status), this.ConvertToProperCase(_value.type), _value.requestId);
                    return newTransaction;
                });
            });
    }

    GetFundTotal(): Observable<any> {
        const x = this.$http.get(`${this.apiUrl}ActionRequest?filter=%7B%22where%22%3A%7B%22type%22%3A%22AWARD%22%7D%7D`)
        .map((results) => results.json().reduce((acc, awards) => acc + awards.requestValue, 0));
        return x;
    }

    /**
     * This function returns all transactions that belong to a grantee
     * @param _granteeId The id of grantee as a string
     */
    GetGranteeTransactions(_granteeId: string): Observable<Transactions[]> {
        let owner = this.GetGrantBlockOwnerId(_granteeId);
        return this.$http.get(`${this.apiUrl}queries/selectGranteeActionRequests?owner=${owner}`)
            .map(this.parseTransactions, this)
            .catch((error) => {
                console.info('Error Getting Blockchain Transactions', error);
                let granteesTransactions = this.$transactions.GetGranteesTransactions(_granteeId)
                    .sort((x, y) => { return y.date.valueOf() - x.date.valueOf() })
                    .map((trans) => {
                        if (trans.type !== 'AWARD') {
                            trans.approvers = this.$transactions.SelectRandomApprovers(_granteeId);
                        }
                        return trans;
                    })
                return of(granteesTransactions);
            })
    }

    /**
     * This function returns all transaction approvals that belong to a grantee
     * @param _granteeId The id of grantee as a string
     */
    GetGranteeApprovals(_granteeId: string): Observable<TransactionApprover[]> {
        /*
        let owner = this.GetGrantBlockOwnerId(_granteeId);
        return this.$http.get(`${this.apiUrl}queries/selectGranteesActionRequestsForValidation?owner=${owner}`)
            .map(this.parseTransactionApprovers, this)
            .catch((error) => {
                console.info('Error Getting Blockchain Transactions', error);
                let granteesTransactions = this.$transactions.GetGranteesTransactions(_granteeId)
                    .sort((x, y) => { return y.date.valueOf() - x.date.valueOf() })
                    .map((trans) => {
                        if (trans.type !== 'AWARD') {
                            trans.approvers = this.$transactions.SelectRandomApprovers(_granteeId);
                        }
                        return trans;
                    })
                return of(granteesTransactions);
            })
        */
        return this.GetAllTransactions().map((_allTrans: Transactions[]) => {
            return _allTrans.filter((_trans) => {
                return _trans.type.toLocaleLowerCase() === 'drawdown' && _trans.approvers && _trans.approvers.length > 0;
            })
                // .map((_trans) => {
                //     if (_trans.type.toLocaleLowerCase() === 'drawdown' ) {
                //         return _trans;
                //     }
                // })
                .filter((_trans: Transactions) => {
                    let approvers = _trans.approvers.map((x) => { return x.approverId });
                    if (approvers.indexOf(_granteeId) > -1) {
                        return _trans;
                    }
                }).map((_trans: Transactions) => {
                    let approvalStatus = _trans.approvers.filter(x => { return x.approverId === _granteeId })[0].approvalStatus;
                    return new TransactionApprover(_granteeId, _trans.transactionId, _trans.date, _trans.amount.toString(), approvalStatus, _trans.status, _trans.receiptImage, _trans.receiptHash, _trans.purpose)
                })
        })
    }

    /**
     * This function returns the available balance of the specified grantee.
     * @param _granteeId The string Id of the grantee
     * @returns Observable<string>
     */
    async GetGranteeAvailableBalance(_granteeId: string) {
        let availableBalance: number = 0;

        let granteesTransactions = await this.GetGranteeTransactions(_granteeId).toPromise();
        if (granteesTransactions.length > 0) {
            availableBalance = granteesTransactions
                .map(x => x.amount)
                .reduce((_runningTotal, _currentValue) => {
                    return _runningTotal + _currentValue
                })
        }

        return availableBalance;
    }

    /**
     * This function is used to create a new transaction
     * @param _payload An object containing a requestValue and a requestor id
     */
    CreateTransaction(_payload: { requestValue: number, requestor: string, receiptHash?: string, receiptImage?: string, purpose?:string }): Observable<any> {
        _payload["$class"] = `${this.namespacePrefix}.CreateActionRequest`;
        // console.log(_payload);
        return this.$http.post(`${this.apiUrl}CreateActionRequest`, _payload);
    }

    AddValidatingGrantees(_transactionId: string, _numberOfValidators?: number): Observable<Response> {
        let transactionApprovers: TransactionApprover[] = [];
        _numberOfValidators = _numberOfValidators || 3;
        let _payload = {
            "$class": `${this.namespacePrefix}.AddValidatingGrantees`,
            "validators": _numberOfValidators.toString(),
            "request": _transactionId
        }
        return this.$http.post(`${this.apiUrl}AddValidatingGrantees`, _payload).map(
            (results) => {
                return results.json();
            },
            (error)=>{
                console.log(error);
            }
        );
    }

    /**
     * This function is used to validate existing transactions
     * @param _payload An object containing all the required parameters to validate a transaction
     */
    ValidateTransaction(_payload:{approve:Boolean, approver:string,request:string,receiptHash:string, comment:string, reasonRejected?:string}): Observable<any>{
        _payload["$class"] = `${this.namespacePrefix}.ApproveActionRequest`;
        return this.$http.post(`${this.apiUrl}ApproveActionRequest`, _payload);
    }


    /**
     * This function gets a record of all actions against the blockchain
     */
    GetTransactionHistory(_filter?:string):Promise<Transactions[]>{
        let queryUrl = `${this.apiUrl}ActionRequest`;
        if(_filter){
            queryUrl += `?filter=${encodeURI(_filter)}`
        }
        return new Promise((resolve,reject)=>{
            this.$http.get(queryUrl).subscribe(
                (results)=>{
                    resolve(this.parseTransactions(results));
                },
                (error)=>{
                    reject(error);
                }
            )
        })
    }

    GetApproveActionRequestHistory(_filter?){
        let _filterQuery = encodeURIComponent(`{"where":{"request":"${this.FormatResourceRelationship(HyperledgerClass.ActionRequest,_filter)}"}}`);
        let _queryUrl:string = _filter == undefined ? `${this.apiUrl}ApproveActionRequest` : `${this.apiUrl}ApproveActionRequest?filter=${_filterQuery}`
        console.log(_queryUrl)
        return new Promise((resolve,reject)=>{
            this.$http.get(`${_queryUrl}`).subscribe(
                (results)=>{
                    resolve(results.json().map((x)=>{
                        x.timestamp = new Date(x.timestamp);
                        x.approver = decodeURIComponent(x.approver).match(/Grantee\#(g.*)$/)[1]
                        return x;
                    }));
                },
                error=>{reject(error)}
            )
        });
    }
}
