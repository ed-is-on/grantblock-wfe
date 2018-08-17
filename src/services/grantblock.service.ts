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
    //    console.log('Decoded Value - ', decodeURIComponent(result.owner).match()[1]);
    private granteePattern: RegExp = /Grantee\#(g.*)\}$/;

    constructor(
        private $http: Http,
        private $granteeService: GranteeService,
        private $transactions: TransactionsService
    ) {
        this.apiUrl = 'http://edhyperledger.eastus2.cloudapp.azure.com:3000/api/'
    }

    private GetGrantBlockOwnerId(_granteeId: string): string {
        return `resource:com.usgov.ed.grants.Grantee%23Resource%2520%257Bid=com.usgov.ed.grants.Grantee%2523${_granteeId}%257D`;
    }

    private parseTransactions(response): any {
        var transactions = response.json().map((_value) => {
            var ownerId = decodeURIComponent(_value.owner).match(this.granteePattern)[1];
            // console.log(decodeURIComponent(_value.owner));
            // console.log(decodeURIComponent(_value.owner).match(this.granteePattern));
            return _value = new Transactions(ownerId, '', _value.requestValue)
        });

        return transactions;

    }

    GetAllGrantees(): Observable<Grantee[]> {
        return this.$http.get(this.apiUrl + 'Grantee').map((results) => {
            return results.json().map((_value) => {
                return _value = new Grantee(_value.pocName, _value.grantBalance, _value.userId, _value.pocEmail);
            });
        })
        .catch((error)=>{
            console.info('Error Accessing Blockchain', error);
            return of(this.$granteeService.GetAllGrantees().sort((x,y)=>{if(x.Name < y.Name){return -1}else{return 1}}));
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
            .catch((error)=>{
                console.info('Error Getting Blockchain Transactions', error);
                var granteesTransactions = this.$transactions.GetGranteesTransactions(_granteeId)
                            .sort((x, y) => { return y.date.valueOf() - x.date.valueOf() })
                            .map((trans)=>{
                                trans.approvers = this.$transactions.SelectRandomApprovers(_granteeId);
                                return trans;
                            })
                return of(granteesTransactions);
            })
    }



}