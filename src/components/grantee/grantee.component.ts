import { Component, OnInit } from '@angular/core'
import { GranteeService } from '../../services/grantee.service'
import { Grantee } from '../../models/grantee.model';
import { of } from 'rxjs/observable/of';



@Component({
  selector: 'grantee-view',
  templateUrl: './grantee.component.html',
  styleUrls: ['./grantee.component.css', '../../app/app.component.css'],
  providers: [GranteeService]
})
export class GranteeComponent implements OnInit {

  allGrantees: Grantee[];
  grantee: Grantee;

  constructor(
    private $granteeService: GranteeService
  ) { }

  ngOnInit(){
    this.GetHyperledgerGrantees();
  }
  
  GetAllGrantees():Grantee[]{
    return this.$granteeService.GetAllGrantees().sort((x,y)=>{if(x.Name < y.Name){return -1}else{return 1}});
  }

  GetHyperledgerGrantees(){
    const grantees:Grantee[] = [];
    try {
      this.$granteeService.GetAllGrantees2().subscribe((x) => {x.forEach(_x=>grantees.push(
        new Grantee(_x.pocName, _x.grantBalance, _x.userId)
      ))})
  
      this.allGrantees = grantees;
      return grantees
    } catch (error) {
      this.allGrantees = this.GetAllGrantees();      
      return grantees
    }
  }

  UpdateSelectedGrantee(_grantee){
    this.grantee = _grantee
  }
  
}

