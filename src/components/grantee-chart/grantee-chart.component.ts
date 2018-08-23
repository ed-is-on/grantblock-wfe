import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import chartData from './grantee-chart.data';
import { Transactions } from '../../models/transactions.model';
import { Grantee } from '../../models/grantee.model';
import { TransactionsService } from '../../services/transactions.service'
import { GrantBlockService } from '../../services/grantblock.service';

@Component({
  selector: 'grantee-chart',
  templateUrl: './grantee-chart.component.html',
  styleUrls: ['./grantee-chart.component.css'],
  providers: [TransactionsService, GrantBlockService],
  inputs: ['UpdateTransactions']
})
export class GranteeChartComponent implements OnInit, OnDestroy {
  /** This property is used to toggle the highcharts display*/
  showChart: Boolean = false;
  /** This property is used to store the selected grantee that is passed into this component */
  selectedGrantee: Grantee;
  allTransactions: Transactions[];
  chartData: {
    amounts: number[],
    dates: string[]
  } = {
      amounts: [],
      dates: []
    };

  /** An input property that runs a function when a new grantee is passed into this component */
  @Input() set UpdateSelectedGrantee(_grantee: Grantee) {
    this.selectedGrantee = _grantee;
    this.bootstrapComponent();
  }

  /** An event emmitter input property that is used to update the grantee chart component */
  @Input() UpdateTransactions: EventEmitter<void>;

  constructor(
    public $transactions: TransactionsService,
    private $grantblockService: GrantBlockService
  ) { }

  ngOnInit() {
    if (this.UpdateTransactions) {
      // subscribing to the Update Transactions event. 
      this.UpdateTransactions.subscribe(() => {
        this.bootstrapComponent();
      },
        () => { console.log('error emmitting transaction update') },
        () => { console.log('subscription complete') })
    }
  }

  ngOnDestroy() {
    if (this.UpdateTransactions) {
      this.UpdateTransactions.unsubscribe();
    }
  }

  /**
   * This function retrieves transactions for the selected grantee, sorts them by date and then calls another function to parse out the chart data
   */
  bootstrapComponent() {
    if (this.selectedGrantee) {
      this.$grantblockService.GetGranteeTransactions(this.selectedGrantee.Id).subscribe((_allTransactions) => {
        this.allTransactions = _allTransactions
          .sort((a, b) => { return a.date.valueOf() - b.date.valueOf() });
        this.ParseChartData();
      },
        (_error) => {
          console.log(_error);
        })
    }
  }

  /**
   * This function is used to extract data in the format requried for the chart
   */
  ParseChartData() {
    // Set Amounts
    let _amounts: number[] = [];
    // adding the initial amount to the chart
    // this.allTransactions.unshift(new Transactions(this.selectedGrantee.Id, this.selectedGrantee.Name, this.selectedGrantee.Amount, new Date('10/1/2016')));
    // Push running total into the _amounts array
    if (this.allTransactions.length > 0) {
      _amounts.push(this.allTransactions[0].amount);
      this.allTransactions
        .map((_trans) => {
          return _trans.amount;
        })
        .reduce((total, currentAmount) => {
          _amounts.push(total + currentAmount);
          return total + currentAmount;
        });
      // _amounts.unshift(this.selectedGrantee.Amount);
      this.chartOptions.series[0].data = _amounts;

      // Set Dates
      this.chartOptions.xAxis.categories = this.allTransactions.map((_trans) => {
        return _trans.date.toLocaleDateString();
      })

      // Display Chart
      this.showChart = true;
    }
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
      labels: {
        format: '${value:,.0f}'
      }
    },
    tooltip: {
      pointFormat: "${point.y:,.2f}"
    },
    chart: {
      height: (9 / 16 * 100) + '%'
    },
    title: {
      text: 'Grantee Drawdowns'
    },
    credits: {
      enabled: false
    },
    className: "hcStyleRef"
  }

  Highcharts = Highcharts;

}