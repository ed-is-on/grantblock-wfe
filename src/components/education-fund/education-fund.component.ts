import { Component, OnInit, OnChanges } from '@angular/core';
import { Award } from '../../models/award.model';
import { GrantBlockService } from '../../services/grantblock.service';
import { Grantee } from '../../models/grantee.model';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from "rxjs";

@Component({
  selector: 'education-fund',
  templateUrl: './education-fund.component.html',
  styleUrls: ['./education-fund.component.css']
})
export class EducationFundComponent implements OnInit {

  pageInfo = { Title: 'Education Fund', Description: 'Dept. of Ed Employees can fund grantees directly.' }
  newAwards: Award[] = [];
  allGrantees: Grantee[];
  fundGrantees: FormGroup;

  // Form Controls
  selectedGrantees = new FormControl();

  constructor(
    private $grantblockService: GrantBlockService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.fundGrantees = this.formBuilder.group({
      selectedGrantees: ['', Validators.required]
    })
    this.GetAllGrantees();
    this.onFormChanges();
  }

  onFormChanges(): void {
    //Detect changes from the grantees selected
    this.fundGrantees.get('selectedGrantees').valueChanges.subscribe((val: Grantee[]) => {
      // Create a new award for each selected grantee, if the grantee wasn't already selected
      val.forEach(x => {
        let uniqueId = `${x.Name}-${x.Id}`;

        // Looking for the current value's Id in the list of awards
        if(this.newAwards.map(x=>`${x.name}-${x.owner}`).join(",").indexOf(uniqueId) === -1){
          let award = new Award();
          award.owner = x.Id;
          award.name = x.Name;
          // Get the available balance for each Grantee
          this.$grantblockService.GetGranteeAvailableBalance(x.Id).then((x) => {
            award.availableBalance = x;
          })
          this.newAwards.push(award);
        }
      })
      this.newAwards = this.newAwards.filter((award)=>{
        let uniqueId = `${award.name}-${award.owner}`;
        return val.map(x=>`${x.Name}-${x.Id}`).join(',').indexOf(uniqueId) > -1
      })
    })
  }

  SumTotal(_a, _b) {
    return parseInt(_a) + parseInt(_b);
  }

  ShowValues() {
    console.log(this.newAwards);
  }

  GetAllGrantees() {
    this.$grantblockService.GetAllGrantees().subscribe(
      (_grantees) => { this.allGrantees = _grantees },
      (_error) => { console.log(_error) }
    )
  }

  AwardGrantees(){
    let _awardPayload = [];
    this.newAwards.forEach(_award=>{
      // Making sure that the award is a positive integer
      _award.requestValue = Math.abs(_award.requestValue)
      _awardPayload.push(this.$grantblockService.CreateAward(_award))
    })
    console.log(_awardPayload);
    forkJoin(_awardPayload).subscribe(
      (results)=>{console.log(results)},
      (error)=>{console.log(error)}
    )
  }

}
