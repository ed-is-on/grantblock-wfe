import { Injectable } from '@angular/core';
import $dataFactory from '../data';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GranteeService{

  constructor(
  ){

  }

  GetAllGrantees(){
    return $dataFactory.wizards;    
  }
}