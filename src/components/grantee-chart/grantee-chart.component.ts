import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import chartData from './grantee-chart.data';
import { Transactions } from '../../models/transactions.model';
import { Grantee } from '../../models/grantee.model';
import { TransactionsService } from '../../services/transactions.service'

@Component({
  selector: 'grantee-chart',
  templateUrl: './grantee-chart.component.html',
  styleUrls: ['./grantee-chart.component.css'],
  providers: [TransactionsService]
})
export class GranteeChartComponent implements OnInit {

  selectedGrantee: Grantee;
  allTransactions: Transactions[];
  chartData: {
    amounts: number[],
    dates: string[]
  } = {
    amounts: [],
    dates: []
  };

  @Input() set UpdateSelectedGrantee(_grantee: Grantee) {
    this.selectedGrantee = _grantee;
    this.bootstrapComponent();
  }

  constructor(
    public $transactions: TransactionsService
  ) { }

  ngOnInit() {
    // this.bootstrapComponent();
  }

  /**
   * This function retrieves transactions for the selected grantee, sorts them by date and then calls another function to parse out the chart data
   */
  bootstrapComponent() {
    if (this.selectedGrantee) {
      this.allTransactions = this.$transactions.GetGranteesTransactions(this.selectedGrantee.Id)
        .sort((a, b) => { return a.date.valueOf() - b.date.valueOf() });
      this.ParseChartData();
    }
  }

  /**
   * This function is used to extract data in the format requried for the pie chart
   */
  ParseChartData() {
    // Set Amounts
    let _amounts: number[] = [];
    // adding the initial amount to the chart
    this.allTransactions.unshift(new Transactions(this.selectedGrantee.Id, this.selectedGrantee.Name, this.selectedGrantee.Amount, new Date('10/1/2016')));
    // Push running total into the _amounts array
    this.allTransactions
      .map((_trans) => {
        return _trans.amount;
      })
      .reduce((total, currentAmount) => {
        _amounts.push(total + currentAmount);
        return total + currentAmount;
      });
    _amounts.unshift(this.selectedGrantee.Amount);
    this.chartOptions.series[0].data = _amounts;

    // Set Dates
    this.chartOptions.xAxis.categories = this.allTransactions.map((_trans) => {
      return _trans.date.toLocaleDateString();
    })
  }

  chartOptions = {
    series: [{
      name: 'Available Balance',
      data: this.chartData.amounts.length > 0 ? this.chartData.amounts : chartData.data
    }],
    xAxis: {
      categories: this.chartData.dates.length > 0 ? this.chartData.dates : chartData.series
    },
    yAxis: {
      title: {
        text: 'Dollars'
      },
      labels:{
        format: '${value:,.0f}'
      }
    },
    tooltip:{
      pointFormat:"${point.y:,.2f}"
    },
    title: {
      text: 'Grantee Drawdowns'
    },
    credits:{
      enabled: false
    }
  }
  Highcharts = Highcharts;

}