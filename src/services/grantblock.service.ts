import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GrantBlockNameSpaces } from '../models/namespaces.enum';
import { Grantee } from '../models/grantee.model';
import { Observable, of } from '../../node_modules/rxjs';
import { Transactions } from '../models/transactions.model';
import { GranteeService } from './grantee.service';
import { TransactionsService } from './transactions.service';


@Injectable()
export class GrantBlockService {

    private apiUrl: string;
    private granteePattern: RegExp = /Grantee\#(g.*)$/;
    private namespacePrefix: string = "com.usgov.ed.grants";

    constructor(
        private $http: Http,
        private $granteeService: GranteeService,
        private $transactions: TransactionsService
    ) {
        this.apiUrl = 'http://edhyperledger.eastus2.cloudapp.azure.com:3000/api/'
    }

    private GetGrantBlockOwnerId(_granteeId: string): string {
        return `resource%3Acom.usgov.ed.grants.Grantee%23${_granteeId}`;
    }

    private parseTransactions(response): any {
        var transactions = response.json().map((_value) => {
            var ownerId = decodeURIComponent(_value.owner).match(/Grantee\#(g.*)$/)[1];
            return new Transactions(ownerId, '', _value.requestValue, new Date(_value.createdDate), null, null, _value.status, _value.type);
        });
        return transactions;

    }

    GetAllGrantees(): Observable<Grantee[]> {
        return this.$http.get(this.apiUrl + 'Grantee').map((results) => {
            return results.json().map((_value) => {
                return _value = new Grantee(_value.pocName, _value.grantBalance, _value.userId, _value.pocEmail);
            });
        })
            .catch((error) => {
                console.info('Error Accessing Blockchain', error);
                return of(this.$granteeService.GetAllGrantees().sort((x, y) => { if (x.Name < y.Name) { return -1 } else { return 1 } }));
            })
    }

    GetAllTransactions(): Observable<any> {
        return this.$http.get(`${this.apiUrl}ActionRequest`)
            .map((results) => {
                return results.json()
                    .map((_value) => {
                        var transactionId = decodeURIComponent(_value.owner).match(this.granteePattern)[1];
                        console.log(decodeURIComponent(_value.owner));
                        // console.log(decodeURIComponent(_value.owner).match(this.granteePattern));
                        return _value = new Transactions(transactionId, '', _value.requestValue)
                    })
            })
    }

    GetGranteeTransactions(_granteeId: string): Observable<Transactions[]> {
        var owner = this.GetGrantBlockOwnerId(_granteeId);
        return this.$http.get(`${this.apiUrl}queries/selectGranteeActionRequests?owner=${owner}`)
            .map(this.parseTransactions)
            .catch((error) => {
                console.info('Error Getting Blockchain Transactions', error);
                var granteesTransactions = this.$transactions.GetGranteesTransactions(_granteeId)
                    .sort((x, y) => { return y.date.valueOf() - x.date.valueOf() })
                    .map((trans) => {
                        if(trans.type !== 'AWARD'){
                            trans.approvers = this.$transactions.SelectRandomApprovers(_granteeId);
                        }
                        return trans;
                    })
                return of(granteesTransactions);
            })
    }

    /**
     * This function returns the available balance of the specified grantee.
     * @param _granteeId The string Id of the grantee
     * @returns Observable<string> 
     */
    async GetGranteeAvailableBalance(_granteeId: string) {
        var availableBalance: number = 0;

        var granteesTransactions = await this.GetGranteeTransactions(_granteeId).toPromise();
        if(granteesTransactions.length > 0){
            availableBalance = granteesTransactions
                .map(x => x.amount)
                .reduce((_runningTotal, _currentValue) => {
                    return _runningTotal + _currentValue
                })
        }

        return availableBalance;
    }

    CreateTransaction(_payload: { requestValue: number, requestor: string }): Observable<any> {
        var result;
        _payload["$class"] = `${this.namespacePrefix}.CreateActionRequest`;
        // console.log(_payload);
        return this.$http.post(`${this.apiUrl}CreateActionRequest`, _payload)
    }


}