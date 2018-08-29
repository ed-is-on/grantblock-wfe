import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GrantBlockNameSpaces } from '../models/namespaces.enum';
import { Grantee } from '../models/grantee.model';
import { Observable, of } from '../../node_modules/rxjs';
import { Transactions } from '../models/transactions.model';
import { GranteeService } from './grantee.service';
import { TransactionsService } from './transactions.service';
import { TransactionApprover, enumApprovalStatus } from '../models/approver.model';


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
            let transaction = new Transactions(ownerId, '', _value.requestValue, new Date(_value.createdDate), null, null, _value.status, _value.type, _value.requestId);
            if (_value.assignedValidators && _value.assignedValidators.length > 0) {
                let transactionApprovers: TransactionApprover[] = [];
                _value.assignedValidators.forEach((_approver) => {
                    transactionApprovers.push(new TransactionApprover(_approver.userId, enumApprovalStatus.Pending))
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
            let approver = new TransactionApprover(ownerId);
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
            .map((results) => {
                return results.json()
                    .map((_value) => {
                        const granteeId = decodeURIComponent(_value.owner).match(this.granteePattern)[1];
                        // console.log(decodeURIComponent(_value.owner));
                        // console.log(decodeURIComponent(_value.owner).match(this.granteePattern));

                        const newTransaction = new Transactions(granteeId, '', _value.requestValue, new Date(_value.createdDate), '', '', this.ConvertToProperCase(_value.status), this.ConvertToProperCase(_value.type), _value.requestId);
                        if (_value.assignedValidators && _value.assignedValidators.length > 0) {
                            newTransaction.approvers = [];
                            _value.assignedValidators.forEach((_validator) => {
                                newTransaction.approvers.push(new TransactionApprover(_validator.userId))
                            })
                        }
                        return newTransaction;
                    });
            });
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
    GetGranteeApprovals(_granteeId: string): Observable<Transactions[]> {
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
            return _allTrans.filter((_trans)=>{
                return _trans.type.toLocaleLowerCase() === 'drawdown';
            }).map((_trans) => {
                if (_trans.type.toLocaleLowerCase() === 'drawdown' && _trans.approvers && _trans.approvers.length > 0) {
                    return _trans;
                }
            }).filter((_trans: Transactions) => {
                let approvers = _trans.approvers.map((x)=>{return x.approverId});
                if(approvers.indexOf(_granteeId) > -1){
                    return _trans;
                }
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
    CreateTransaction(_payload: { requestValue: number, requestor: string }): Observable<any> {
        let result;
        _payload["$class"] = `${this.namespacePrefix}.CreateActionRequest`;
        // console.log(_payload);
        return this.$http.post(`${this.apiUrl}CreateActionRequest`, _payload)
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
            });
    }
}
