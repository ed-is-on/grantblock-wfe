import { Injectable } from '@angular/core';
import $dataFactory from '../data';
import { DataService } from '../hyperledger/data.service';
import { Grantee } from '../hyperledger/com.usgov.ed.grants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GranteeService{

  constructor(
    private $dataService : DataService<Grantee>
  ){

  }

  GetAllGrantees(){
    return $dataFactory.wizards;    
  }

  GetAllGrantees2():Observable<Grantee[]>{
    try {
      return this.$dataService.getAll(`Grantee`);
    } catch (error) {
      return error;      
    }
  }

}