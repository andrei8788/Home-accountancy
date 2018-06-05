import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";

import {BaseApi} from "../../../shared/core/base-api";
import {SDHEvent} from "../models/event.model";

@Injectable()
export class EventsService extends BaseApi {
  constructor(http: HttpClient) {
    super(http)
  }

  addEvent(event: SDHEvent): Observable<SDHEvent> {
    return this.post('events', event);
  }

  getEvents(): Observable<SDHEvent[]> {
    return this.get('events');
  }

  getEventById(id: string): Observable<SDHEvent> {
    return this.get(`events${id}`);
  }

}
