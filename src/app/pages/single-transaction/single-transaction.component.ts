import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-single-transaction',
  templateUrl: './single-transaction.component.html',
  styleUrls: ['./single-transaction.component.scss'],
})
export class SingleTransactionComponent  implements OnInit {

  @Input("transactions") transactions: any

  constructor(private mdc:ModalController) { }

  ngOnInit() {
    console.log(this.transactions)
  }

  cancel() {
    return this.mdc.dismiss(null, 'cancel');
  }
}
