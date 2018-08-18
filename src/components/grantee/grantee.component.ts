import { Component, OnInit } from '@angular/core'
import { GranteeService } from '../../services/grantee.service'
import { Grantee } from '../../models/grantee.model';
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
        this.allGrantees = result;
    },()=>{
      // Getting data from the grantee from the demo if hyperledger is unavailable 
      this.allGrantees = this.$granteeService.GetAllGrantees().sort((x,y)=>{if(x.Name < y.Name){return -1}else{return 1}});
    })
  }

  UpdateSelectedGrantee(_grantee) {
    this.grantee = _grantee
  }

}

