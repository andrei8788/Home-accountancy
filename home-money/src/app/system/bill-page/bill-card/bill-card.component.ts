import {Component, Input, OnInit} from '@angular/core';
import {Bill} from "../../shared/models/bill.model";

@Component({
  selector: 'sdh-bill-card',
  templateUrl: './bill-card.component.html',
  styleUrls: ['./bill-card.component.scss']
})
export class BillCardComponent implements OnInit {

  @Input() bill: Bill;
  @Input() currency: any;

  dollar: number;
  euro: number;

  constructor() { }

  ngOnInit() {
    const { USD, EUR } = this.currency;
    this.dollar = (1/USD['Cur_OfficialRate'])*this.bill.value;
    this.euro = (1/EUR['Cur_OfficialRate'])*this.bill.value;
  }

}
