import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {combineLatest, Subscription} from 'rxjs';
import {Bill} from "../shared/models/bill.model";
import {delay} from "rxjs/operators";

@Component({
  selector: 'sdh-bill-page',
  templateUrl: './bill-page.component.html',
  styleUrls: ['./bill-page.component.scss']
})
export class BillPageComponent implements OnInit, OnDestroy {

  private sub1: Subscription; // Для отписки от события чтобы не засаряло память (subscription)
  private sub2: Subscription;

  currency: any;
  bill: Bill;

  isLoaded = false; // флаг который "говорит" приложению происходит ли сейчас загрузка (для избежания ошибки при загрузке когда bill.value передаётся undefined)

  constructor(private billService: BillService) {
  }

  ngOnInit() {
    this.sub1 = combineLatest( // Чтобы синхронизировать запросы т к они приходят в разное время
      this.billService.getBill(),
      this.billService.getCurrencyUSD(),
      this.billService.getCurrencyEUR()

    ).subscribe((data: [Bill, any, any]) => {
      this.bill = data[0];
      this.currency = {
        USD: data[1],
        EUR: data[2]
      };

      this.isLoaded = true;
    })
  }

  onRefresh() {
    this.isLoaded = false;
    this.sub2 = combineLatest(
      this.billService.getCurrencyUSD(),
      this.billService.getCurrencyEUR())
      .pipe(delay(2000))
      .subscribe((currency: any) => {
        this.currency = {
          USD: currency[0],
          EUR: currency[1]
        };
      this.isLoaded = true;
    })
  }

  ngOnDestroy() {
    this.sub1.unsubscribe(); // отписываемся после срабатывания ngOnInit, чтобы не засоряло память? Ну и для более быстрой работы приложения
    if (this.sub2) { // т.к sub2 при загрузке не вызывается
      this.sub2.unsubscribe();
    }
  }

}
