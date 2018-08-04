import { Component, OnInit } from '@angular/core'
import { GranteeService } from '../../services/grantee.service'
import { Grantee } from '../../models/grantee.model';


@Component({
  selector: 'grantee-view',
  templateUrl: './grantee.component.html',
  styleUrls: ['./grantee.component.css', '../../app/app.component.css'],
  providers: [GranteeService]
})
export class GranteeComponent implements OnInit {

  grantee: Grantee;

  constructor(
    private $granteeService: GranteeService
  ) { }

  ngOnInit(){
    
  }
  
  GetAllGrantees():Grantee[]{
    return this.$granteeService.GetAllGrantees().sort((x,y)=>{if(x.Name < y.Name){return -1}else{return 1}});
  }

  UpdateSelectedGrantee(_grantee){
    this.grantee = _grantee
  }
  
}

