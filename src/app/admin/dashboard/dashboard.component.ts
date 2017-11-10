import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  public past_events_lb = [{ name: 'Past Events', value: 0 }];
  public past_events_bg = { domain: ['#606060'] };

  public future_events_lb = [{ name: 'Future Events', value: 0 }];
  public future_events_bg = { domain: ['#0096A6'] };

  public infoLabelFormat(c): string {
    switch(c.data.name) {
      case 'Past Events':
        return `<i class="fa fa-calendar mr-2"></i>${c.label}`;
      case 'Future Events':
        return `<i class="fa fa-calendar mr-2"></i>${c.label}`;
      default:
        return c.label;
    }
  }

  public infoValueFormat(c): string {
    switch(c.data.extra ? c.data.extra.format : '') {
      case 'currency':
        return `\$${Math.round(c.value).toLocaleString()}`;
      case 'percent':
        return `${Math.round(c.value * 100)}%`;
      default:
        return c.value.toLocaleString();
    }
  }

  private Event;
  public Event_Future;

  constructor(
    @Inject('dashboardService') private dashboardService:any,
  ) {
    dashboardService.event().subscribe(
      res => {
        this.Event = res.result.Event;
        this.past_events_update();
        this.future_events_update();
      },
      err => {
        console.log('err');
      }
    );
  }

  past_events_update() {
    let past_events = this.Event.filter(function(e, i) {
      return moment().isAfter(e.StartDateTime.iso) && e.Status === 'Finished'
    });
    this.past_events_lb = [{ name: 'Past Events', value: past_events.length }];
  }

  future_events_update() {
    this.Event_Future = this.Event.filter(function(e, i) {
      return moment().isBefore(e.StartDateTime.iso) && e.Status === 'Published'
    });

    this.future_events_lb = [{ name: 'Future Events', value: this.Event_Future.length }];

  }

  dateFormat(date) {
    return moment(date).format('hh:mm MMM DD YYYY')
  }
}