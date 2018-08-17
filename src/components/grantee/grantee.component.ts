import { Component, OnInit } from '@angular/core'
import { GranteeService } from '../../services/grantee.service'
import { Grantee } from '../../models/grantee.model';
import { of } from 'rxjs/observable/of';
import { GrantBlockService } from '../../services/grantblock.service';



@Component({
  selector: 'grantee-view',
  templateUrl: './grantee.component.html',
  styleUrls: ['./grantee.component.css', '../../app/app.component.css'],
  providers: [GranteeService, GrantBlockService]
})
export class GranteeComponent implements OnInit {

  allGrantees: Grantee[];
  grantee: Grantee;

  constructor(
    private $granteeService: GranteeService,
    private $grantBlockService: GrantBlockService
  ) { }

  async ngOnInit() {
    this.GetAllGrantees();
  }

  GetAllGrantees() {
    this.$grantBlockService.GetAllGrantees().subscribe((result) => {
      if(result.length > 0){
        this.allGrantees = result;
      } else {
        this.allGrantees = this.$granteeService.GetAllGrantees().sort((x,y)=>{if(x.Name < y.Name){return -1}else{return 1}});
      }
    })
  }

  UpdateSelectedGrantee(_grantee) {
    this.grantee = _grantee
  }

}

