import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Transactions } from '../../../models/transactions.model';
import { Grantee } from '../../../models/grantee.model';
import { DataService } from '../../../hyperledger/data.service';
import * as HyperLedgerClasses from '../../../hyperledger/com.usgov.ed.grants';
import { CreateActionRequest } from '../../../hyperledger/com.usgov.ed.grants';
import { Http } from '@angular/http';
import { GrantBlockService } from '../../../services/grantblock.service';
import { AzureService } from '../../../services/azure.service';


@Component({
  selector: 'new-transaction-dialog',
  templateUrl: './transaction.dialog.component.html',
  styleUrls: ['./transaction.dialog.component.css']
})
export class TransactionDialogComponent implements OnInit {

  private namespace: string = 'CreateActionRequest';
  private receiptName: string;

  newTransactionData: {
    amount?: number,
    location?: string,
    purpose?: string,
    attachments?: File,
    grantee?: Grantee
  } = {}

  constructor(
    private $http: Http,
    private $grantBlockService: GrantBlockService,
    private $azureService: AzureService,
    private $dataService: DataService<CreateActionRequest>,
    public thisDialog: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.newTransactionData.grantee = this.data.grantee;
  }

  ngOnInit() {
    this.receiptName = `${this.data.grantee.Id}AR${new Date().toISOString()}`;
    console.log(this.receiptName)
  }

  onFileChange(_event) {
    if (_event.target.files && _event.target.files.length) {
      const [file] = _event.target.files;
      this.newTransactionData.attachments = file;

    } else {
      this.newTransactionData.attachments = undefined;
    }

  }

  private CreateTransaction(receipt): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$grantBlockService.CreateTransaction({ requestValue: this.newTransactionData.amount, requestor: this.data.grantee.Id, receiptHash: receipt.etag, receiptImage: receipt.name })
        .subscribe(
          (results: Response) => {
            if (results.ok) {
              resolve(results.json());
            }
          },
          (error) => {
            console.log('Error: ', error);
            reject(error);
          },
          () => {

          }
        )
    })
  }

  private UploadReceipt(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let newFile = new FileReader();
        newFile.onload = () => {
          var dataArray = newFile.result;
          this.$azureService.postReceipt({ fileName: this.receiptName, fileAsDataUrl: dataArray }).then(
            (result) => {
              if(result){
                resolve(result.json().data);
              }
            },
            (error) => {
              reject(error);
            })
        }
        newFile.readAsDataURL(this.newTransactionData.attachments);
      } catch (error) {
        return reject(error);
      }
    })
  }

  CloseConfirm() {
    this.UploadReceipt().then(
      (results) => {
        this.CreateTransaction(results).then((_results) => {
          this.thisDialog.close({ success: true, data: { results: _results, newTransaction: this.newTransactionData } });
        })
      }).catch(
        (error) => {
          console.error(error);
          this.thisDialog.close({ success: false, data: error })
        })
  }

  CancelConfirm() {
    this.thisDialog.close({ success: false })
  }

  AllowSubmit() {
    let allowSubmit = false;
    if (this.newTransactionData.amount > this.data.availableBalance) {
      allowSubmit = true;
    }
    return allowSubmit;
  }

}