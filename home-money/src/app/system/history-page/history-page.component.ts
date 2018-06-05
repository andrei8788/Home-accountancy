import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from "rxjs/index";
import * as moment from 'moment';

import {CategoriesService} from "../shared/services/categories.service";
import {EventsService} from "../shared/services/events.service";
import {Category} from "../shared/models/category.model";
import {SDHEvent} from "../shared/models/event.model";


@Component({
  selector: 'sdh-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy {

  constructor(
    private categoryService: CategoriesService,
    private eventsService: EventsService
  ) { }

  isLoaded = false;

  sub1: Subscription;
  categories: Category[] = [];

  events: SDHEvent[] = [];
  filteredEvents: SDHEvent[] = [];

  chartData = [];
  isFilterVisible = false;




  ngOnInit() {
    this.sub1 = combineLatest(
      this.categoryService.getCategories(),
      this.eventsService.getEvents()
    ).subscribe((data: [Category[], SDHEvent[]]) => {
      this.categories = data[0];
      this.events = data[1];

      this.setOriginalEvents();
      this.calculateChartData();

      this.isLoaded = true;
    })
  }

  private setOriginalEvents() {
    this.filteredEvents = this.events.slice(); // slice применяем для того чтобы filteredEvents присваивалась ссылка на новый массив с теми же параметрами а не на events
  }

  calculateChartData(): void {
    this.chartData = [];
    this.categories.forEach((cat) => {
      const catEvent = this.filteredEvents.filter((e) => e.category === cat.id && e.type === 'outcome');
      this.chartData.push(
        {
          name: cat.name,
          value: catEvent.reduce((total, e) => {
            total += e.amount;
            return total;
          }, 0)
        }
      )
    })
  }

  private toggleFilterVisibility(dir: boolean) {
    this.isFilterVisible = dir;
  }

  openFilter() {
    this.toggleFilterVisibility(true);
  }

  onFilterApply(filterData) {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();

    const startPeriod = moment().startOf(filterData.period).startOf('d');
    const endPeriod = moment().endOf(filterData.period).endOf('d');

    this.filteredEvents =this.filteredEvents
        .filter((e) => {
          return filterData.types.indexOf(e.type) !== -1;
        })
        .filter((e) => {
          return filterData.categories.indexOf(e.category.toString()) !== -1;
        })
        .filter((e) => {
          const momentDate = moment(e.date, 'DD.MM.YYYY HH.mm.ss')
          return momentDate.isBetween(startPeriod, endPeriod);
        });
    this.calculateChartData(); // перерисовываем наш график
  }

  onFilterCancel() {
    this.toggleFilterVisibility(false);
    this.setOriginalEvents();
    this.calculateChartData();
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
