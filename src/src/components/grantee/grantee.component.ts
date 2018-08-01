import { Component, OnInit } from '@angular/core'
import { GranteeService } from '../../services/grantee.service'


@Component({
  selector: 'grantee-view',
  templateUrl: './grantee.component.html',
  styleUrls: ['./grantee.component.css', '../../app/app.component.css'],
  providers: [GranteeService]
})
export class GranteeComponent implements OnInit {

  grantee;

  constructor(
    private $granteeService: GranteeService
  ) { }

  ngOnInit(){
    
  }
  
  GetAllGrantees(){
    return this.$granteeService.GetAllGrantees().sort((x,y)=>{if(x.name < y.name){return -1}else{return 1}});
  }

  UpdateSelectedGrantee(_grantee){
    this.grantee = _grantee
  }
  
}

