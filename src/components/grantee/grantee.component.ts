import { Component, OnInit, EventEmitter } from '@angular/core'
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
  updatedTransactions: EventEmitter<void> = new EventEmitter<void>();
  displayPod1: Boolean = true;
  displayPod2: Boolean = true;
  displayPod3: Boolean = true;
  displayPod4: Boolean = true;

  constructor(
    private $granteeService: GranteeService,
    private $grantBlockService: GrantBlockService
  ) { }

  async ngOnInit() {
    this.GetAllGrantees();
  }

  GetAllGrantees() {
    this.$grantBlockService.GetAllGrantees().subscribe((result) => {
        this.allGrantees = result
        // Sorting the results alphabetically
        .sort((x,y)=>{ return x.Name > y.Name ? 1 : x.Name < y.Name ? -1 : 0;});
    },()=>{
      // Getting data from the grantee from the demo if hyperledger is unavailable 
      this.allGrantees = this.$granteeService.GetAllGrantees()
        // Sorting the results alphabetically
        .sort((x,y)=>{ return x.Name > y.Name ? 1 : x.Name < y.Name ? -1 : 0;});
    })
  }

  UpdateSelectedGrantee(_grantee) {
    this.grantee = _grantee
  }

  onTransactionsUpdated(){
    // Emmitting an event to all subscribers of the updated Transactions event listener
    this.updatedTransactions.next();
  }

  onMobileView() {
    let _onMobileView: Boolean = true;
    if (window.innerWidth <= 768) {
      _onMobileView = false;
    }
    // console.log(window.innerWidth);
    return _onMobileView;

  }

  togglePod(_podNumber: number) {

    switch (_podNumber) {
      case 1:
        this.displayPod1 = !this.displayPod1;
        break;
      case 2:
        this.displayPod2 = !this.displayPod2;
        break;
      case 3:
        this.displayPod3 = !this.displayPod3;
        break;
      case 4:
        this.displayPod4 = !this.displayPod4;
        break;
      default:
        break;
    }

  }
}

