import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {EventsService} from "../../shared/services/events.service";
import {CategoriesService} from "../../shared/services/categories.service";
import {mergeMap} from "rxjs/internal/operators";
import {SDHEvent} from "../../shared/models/event.model";
import {Category} from "../../shared/models/category.model";
import {Subscription} from "rxjs/index";

@Component({
  selector: 'sdh-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

  event: SDHEvent;
  category: Category;

  isLoaded = false;

  sub1: Subscription;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.sub1 = this.route.params
      .pipe(mergeMap((params: Params) => this.eventService.getEventById(params['id'])))
      .pipe(mergeMap((event: SDHEvent) => {
        this.event = event;
        return this.categoriesService.getCategoryById(event.category)
      }))
      .subscribe((category: Category) => {
        this.category = category;
        this.isLoaded = true;
      })
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
  }

}
