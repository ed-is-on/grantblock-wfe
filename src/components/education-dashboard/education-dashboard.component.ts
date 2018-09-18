import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Transactions } from '../../models/transactions.model';
import chartData from '../grantee-chart/grantee-chart.data';
import { Grantee } from '../../models/grantee.model';
import { TransactionsService } from '../../services/transactions.service'
import { GrantBlockService } from '../../services/grantblock.service';
import { Transaction } from '../../hyperledger/org.hyperledger.composer.system';


@Component({
    selector: "education-dashboard",
    templateUrl: "./education-dashboard.component.html",
    styleUrls: ["./education-dashboard.component.css"]
})
export class EducationDashboardComponent {
 /** This property is used to toggle the highcharts display*/
 showChart: Boolean = false;
 /** This property is used to store the selected grantee that is passed into this component */
 selectedGrantee: Grantee;
 allTransactions: Transactions[];
 topTransactions: Transactions[];
 fundTotal: number;
 chartData: {
   amounts: number[],
   dates: string[]
 } = {
     amounts: [],
     dates: []
   };

 Highcharts = Highcharts;

 constructor(
   public $transactions: TransactionsService,
   private $grantblockService: GrantBlockService
 ) { }

 ngOnInit() {
       this.bootstrapComponent();
 }

 ngOnDestroy() {
 }

 /**
  * This function retrieves transactions for the selected grantee, sorts them by date and then calls another function to parse out the chart data
  */
 bootstrapComponent() {

    this.$grantblockService.GetFundTotal().subscribe((_fundTotal) => {
      this.fundTotal = _fundTotal;
    });

    this.$grantblockService.GetDrawdowns().subscribe((_allTransactions) => {
      this.allTransactions = _allTransactions
        .sort((a, b) => { return a.date.valueOf() - b.date.valueOf() });

      this.topTransactions = _allTransactions
        .sort((a, b) => { return a.amount.valueOf() - b.amount.valueOf()});

      this.ParseChartData();
    },
      (_error) => {
        console.log(_error);
      })
}

 /**
  * This function is used to extract data in the format requried for the chart
  */
 ParseChartData() {

  let _amounts: number[] = [];
  let _topTranAmt = [];
  let _topTranId = [];
  let _topGrantee = [];
  let _topGranteeCnt = [];
  
  // Parse Drawdowns for Line-chart

  if (this.allTransactions.length > 0) {
      _amounts.push(this.fundTotal);

    this.allTransactions
      .map((_trans) => {
        return _trans.amount;
      })
      .reduce((total, currentAmount) => {
        _amounts.push(total + currentAmount + this.fundTotal);
        return total + currentAmount;
      });

      // Parse Top Transaction Amounts
      var loop = 0;
      this.topTransactions.forEach(function (arrayItem) {
        var id = arrayItem.granteeId;
        var amt = arrayItem.amount;
        loop = loop + 1;
        if (loop < 4) {
        _topTranAmt.push([amt*-1]);
        _topTranId.push([id]);
        }
       });

       // Parse Grantees with most Drawdowns

      var granteeArray = this.allTransactions.map(function(item) {
        return item.granteeId
     
      });
     
    // make map:
    var m = granteeArray.reduce(function(a, b) {
      a[b] = ++a[b] || 1;
      return a;
    }, {});
 
    // loop through object (M), get array of keys/values:
    var arr = [];
    for (var xkey in m) {
      arr.push([xkey, m[xkey]]);

    }
    // sort array by values:
    arr.sort(function(a, b) {
      return b[1] - a[1];
    });
    
    // Parse Top Transaction Amounts
    var loop = 0;
    arr.forEach(function (arrayItem) {
        var id = arrayItem[0];
        var cnt = arrayItem[1];
        loop = loop + 1;
        if (loop < 5) {
          _topGrantee.push([id]);
          _topGranteeCnt.push([cnt]);
    }
  });

   //*------------------ Line Chart of Transactions (start) ----------------//

    this.chartOptions.series[0].data = _amounts;
    this.tranChart.series[0].data = _topTranAmt;
    this.granteeCntChart.series[0].data = _topGranteeCnt

    // Set Dates
    this.chartOptions.xAxis.categories = this.allTransactions.map((_trans) => {
      return _trans.date.toLocaleDateString();
    })

    this.tranChart.xAxis.categories = _topTranId;
    this.granteeCntChart.xAxis.categories = _topGrantee;

    // Display Chart
    this.showChart = true;
  }
 }

 chartOptions = {
   series: [{
     name: 'Available Balance',
     data: chartData.data
   }],
   xAxis: {
     categories: chartData.series
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

 // ----------- Column Chart:  Top Transactions ---------------------------
 tranChart = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Top Transactions'
        },
        xAxis: {
          categories:  chartData.series,
          crosshair: true
      },
        yAxis: {
          min: 0,
          title: {
            text: 'Top Transactions'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Amount: <b>${point.y:.2f}</b>'
        },
        series: [{
          name: 'Population',
          data: chartData.data,
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '${point.y:.2f}', // one decimal
            y: 10, // 10 pixels down from the top
            // style: {
            //   fontSize: '13px',
            //   fontFamily: 'Verdana, sans-serif'
            // }
          }
        }],
        credits: {
          enabled: false
        }
    }

    // ----------- Column Chart:  Grantees with most Transactions ---------------------------

 granteeCntChart = {
  chart: {
    type: 'column'
  },
  title: {
    text: 'Grantees with the Most Transactions'
  },
  xAxis: {
    categories:  chartData.series,
    crosshair: true
},
  yAxis: {
    min: 0,
    title: {
      text: 'Transaction Count'
    }
  },
  legend: {
    enabled: false
  },
  tooltip: {
    pointFormat: 'Number of Transactions: <b>{point.y:.0f}</b>'
  },
  series: [{
    name: 'Population',
    data: chartData.data,
    dataLabels: {
      enabled: true,
      rotation: -90,
      color: '#FFFFFF',
      align: 'right',
      format: '{point.y:.0f}', // one decimal
      y: 10, // 10 pixels down from the top
      // style: {
      //   fontSize: '13px',
      //   fontFamily: 'Verdana, sans-serif'
      // }
    }
  }],
  credits: {
    enabled: false
  }
}
//*------------------ Column Chart of Grantee Counts of Transactions (end) ----------------//


    /** The section below has code for the resizing of pods */
    edDisplayPod1: Boolean = true;
    edDisplayPod2: Boolean = true;
    edDisplayPod3: Boolean = true;
    edDisplayPod4: Boolean = true;

    onMobileViewEd() {
        let _onMobileViewEd: Boolean = true;
        if (window.innerWidth <= 768) {
            _onMobileViewEd = false;
        }
        // console.log(window.innerWidth);
        return _onMobileViewEd;

    }

    togglePodEd(_EDpodNumber: number) {

        switch (_EDpodNumber) {
            case 1:
                this.edDisplayPod1 = !this.edDisplayPod1;
                break;
            case 2:
                this.edDisplayPod2 = !this.edDisplayPod2;
                break;
            case 3:
                this.edDisplayPod3 = !this.edDisplayPod3;
                break;
            case 4:
                this.edDisplayPod4 = !this.edDisplayPod4;
                break;
            default:
                break;
        }

    }

}