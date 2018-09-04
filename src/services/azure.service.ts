import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { Http, Response } from "@angular/http";
import { container } from "@angular/core/src/render3/instructions";

declare var AzureStorage: any;

@Injectable()
export class AzureService {

    private baseUrl: string;

    constructor(
        private $http: Http
    ) {
        this.baseUrl = `http://${environment.azureStorage.name}.${environment.azureStorage.baseUrl}:${environment.azureStorage.port}/azure`;
    }

    getReceipts(options?:{receiptName?:string,containerName?:string}): Promise<any> {

        options.containerName = options.containerName || environment.azureStorage.containerName;
        let serviceUrl = `${this.baseUrl}/${options.containerName}`;
        
        if(options.receiptName){
            serviceUrl = `${this.baseUrl}/${options.containerName}/${options.receiptName}`
        }

        return new Promise((resolve,reject) => {
            this.$http.get(encodeURI(serviceUrl)).subscribe(
                (result)=>{
                    resolve(result.json());
                },
                (error)=>{
                    reject(error);
                },
                ()=>{}
            );
        }).catch((error)=>{
            return new Promise(resolve=>{resolve('Node Server Offline')});
        });
    }

    postReceipt(_payload: { fileName: string, fileAsDataUrl: any, containerName?:string }): Promise<any> {
        _payload.containerName = _payload.containerName || environment.azureStorage.containerName
        
        let serviceUrl = `${this.baseUrl}/${_payload.containerName}`;

        return new Promise((resolve, reject) => {
            this.$http.post(`${encodeURI(serviceUrl)}`, _payload).subscribe(
                results => {
                    // console.log('HAZAA!', results);
                    resolve(results);
                },
                error =>{
                    reject(error);
                }
            );
        }).catch((error)=>{
            return new Promise(resolve=>{resolve('Node Server Offline')});
        })

    }

}