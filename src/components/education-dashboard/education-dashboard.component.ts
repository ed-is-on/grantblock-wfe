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


       this.bootstrapComponent();
 
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
   console.log('in education bootstrap')
   

    this.$grantblockService.GetFundTotal().subscribe((_fundTotal) => {
      this.fundTotal = _fundTotal;
      console.log('fundtotal '+this.fundTotal)});

    this.$grantblockService.GetDrawdowns().subscribe((_allTransactions) => {
      this.allTransactions = _allTransactions
        .sort((a, b) => { return a.date.valueOf() - b.date.valueOf() });

      this.topTransactions = _allTransactions
        .sort((a, b) => { return a.amount.valueOf() - b.amount.valueOf()});

      console.log('topTransactions '+this.topTransactions[0].granteeId)
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
  let _tranObj:{id:string, amt:number}[] = [];
  let _topTranAmt = [];
  let _topTranId = [];
  
  
  // adding the initial amount to the chart
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

      //this.topTransactions
      //var _topTrans = this.topTransactions.map(tran => ({ id: tran.granteeId, amt: tran.amount }));
      //console.log('top trans: '+_topTrans[1])
      var loop = 0;
      this.topTransactions.forEach(function (arrayItem) {
        var id = arrayItem.granteeId;
        var amt = arrayItem.amount;
        loop = loop + 1;
        if (loop < 4) {
        _topTranAmt.push([amt*-1]);
        _topTranId.push([id]);
        }
        console.log('id: '+id+' amt '+amt);
    });
   

   //*------------------ Line Chart of Transactions (start) ----------------//

    this.chartOptions.series[0].data = _amounts;
    this.tranChart.series[0].data = _topTranAmt;

    // Set Dates
    this.chartOptions.xAxis.categories = this.allTransactions.map((_trans) => {
      return _trans.date.toLocaleDateString();
    })

    //this.tranChart.xAxis.categories = this.allTransactions.map((_trans) => {
    //    return _trans.date.toLocaleDateString();
    //  })
    this.tranChart.xAxis.categories = _topTranId;

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
          pointFormat: 'Amount of Drawdown: <b>{point.y:.1f} dollar</b>'
        },
        series: [{
          name: 'Population',
          data: chartData.data,
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }]
    }
//*------------------ Line Chart of Transactions (end) ----------------//

 

 Highcharts = Highcharts;


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