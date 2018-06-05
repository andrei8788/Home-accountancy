import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bill} from '../models/bill.model';
import {BaseApi} from "../../../shared/core/base-api";

@Injectable()
export class BillService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }

  getBill(): Observable<Bill> {
    return this.get('bill');
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.put('bill', bill);
  }

  getCurrencyUSD(base: string = '145'): Observable<any> { // удалённый сервер не трогаем
    return this.http.get(`http://www.nbrb.by/API/ExRates/Rates/${base}?Periodicity=0`);
  }

  getCurrencyEUR(base: string = '292') {
    return this.http.get(`http://www.nbrb.by/API/ExRates/Rates/${base}?Periodicity=0`);
  }
}
//
//http://api.fixer.io/latest?base=${base}
