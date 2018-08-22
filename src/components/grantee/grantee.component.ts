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
  displayPod1: Boolean = true;
  displayPod2: Boolean = true;
  displayPod3: Boolean = true;
  displayPod4: Boolean = true;

  constructor(
    private $granteeService: GranteeService
  ) { }

  ngOnInit() {

  }

  GetAllGrantees() {
    return this.$granteeService.GetAllGrantees().sort((x, y) => { if (x.name < y.name) { return -1 } else { return 1 } });
  }

  UpdateSelectedGrantee(_grantee) {
    this.grantee = _grantee
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

