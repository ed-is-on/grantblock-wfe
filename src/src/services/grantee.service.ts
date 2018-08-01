import { Injectable } from '@angular/core';
import $dataFactory from '../data';

@Injectable()
export class GranteeService{

  constructor(){

  }

  GetAllGrantees(){
    return $dataFactory.wizards;
  }


}