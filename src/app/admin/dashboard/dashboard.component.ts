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

  public future_events_table_settings = {
    selectMode: 'single',  //single|multi
    hideHeader: false,
    hideSubHeader: true,
    noDataMessage: 'No data found',
    actions: {
      columnTitle: 'Actions',
      add: false,
      edit: false,
      delete: false,
      custom: [],
      position: 'right' // left|right
    },
    columns: {     
      id: {
        title: 'ID',
        editable: false,
        width: '60px',
        type: 'html',
        valuePrepareFunction: (value) => { return '<div class="text-center">' + value + '</div>'; }       
      },
      Name: {
        title: 'Name',
        type: 'string',
        filter: true
      },
      StartDateTime: {
        title: 'StartDateTime',
        type: 'string',
        filter: true
      },
      EndDateTime: {
        title: 'EndDateTime',
        type: 'string',
        filter: true
      },
      Category: {
        title: 'Category',
        type: 'string'
      }
    },
    pager: {
      display: true,
      perPage: 10
    }
  };

  private Event;
  public Event_Future;

  constructor(
    @Inject('dashboardService') private dashboardService:any,
  ) {
    dashboardService.event().subscribe(
      res => {
        this.Event = res.result.Event.sort(function(a, b) {
          if (moment(a.StartDateTime.iso).isAfter(b.StartDateTime.iso)) {
            return 1
          } else {
            return -1
          }
        });
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

    this.Event_Future.forEach(function(e, i) {
      e.id = i;
      e.Category = e.Category || 'default';
      e.StartDateTime = moment(e.StartDateTime.iso).format('hh:mm MMM DD YYYY');
      e.EndDateTime = moment(e.EndDateTime.iso).format('hh:mm MMM DD YYYY');
    })

    this.future_events_lb = [{ name: 'Future Events', value: this.Event_Future.length }];

  }

  dateFormat(date) {
    return moment(date).format('hh:mm MMM DD YYYY')
  }
}