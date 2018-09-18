import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'education-fund',
  templateUrl: './education-fund.component.html',
  styleUrls: ['./education-fund.component.css']
})
export class EducationFundComponent implements OnInit {

  pageInfo = {Title: 'Education Fund', Description: 'Dept. of Ed Employees can fund grantees directly.'} 

  constructor() { }

  ngOnInit() {
  }

}
