import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';

@Component({
  selector: 'app-event-list',
  templateUrl: './list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EventListComponent {

  public statistics_category_config = {
    showLegend : true,
    gradient : false,
    colorScheme : {
      domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
    },
    showLabels : true,
    explodeSlices : false,
    doughnut : false
  }
  public statistics_category_data = []

  public statistics_order_reservation_config = {
    scheme : {
      domain: ['#606060']
    }
  }
  public statistics_order_reservation_data = [
    {
      name: 'Orders per Reservation',
      value: 0
    }
  ]

  public statistics_guest_reservation_config = {
    scheme : {
      domain: ['#0096A6']
    }
  }
  public statistics_guest_reservation_data = [
    {
      name: 'Guests per Reservation',
      value: 0
    }
  ]

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

  public events_table_settings = {
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
      },
      Status: {
        title: 'Status',
        type: 'string'
      },
      TicketTypes: {
        title: 'TicketTypes',
        type: 'string'
      },
      MaxReservationLength: {
        title: 'MaxReservation',
        type: 'string'
      }
    },
    pager: {
      display: true,
      perPage: 10
    }
  };

  public loading = true;
  public events;
  public reservations;
  public ticket_types;

  public categories;
  public status;
  public max_date;

  public filter_options;
  public filtered_events;

  constructor(
    @Inject('eventService') private eventService:any,
  ) {
    eventService.tables().subscribe(
      res => {
        this.events = res.result.Event;
        this.reservations = res.result.Reservation;
        this.ticket_types = res.result.TicketType;
        this.init_data();
      },
      err => {
        console.log('err');
      }
    );
  }

  init_data() {
    this.events.forEach(e => {
      e.StartDateTime = this.dateFormat(e.StartDateTime.iso);
      e.EndDateTime = this.dateFormat(e.EndDateTime.iso);
      if (!e.Category) e.Category = 'Default'
      if (!e.MaxReservationLength) e.MaxReservationLength = 'none'
      let tickets = [];
      Object.keys(e.TicketTypeTables).forEach(k => {
        let t = this.ticket_types.filter(t => t.objectId === k)[0];
        let ticket_name = t && t.Name || '';
        tickets.push(ticket_name);
      })
      e.TicketTypes = tickets.join(', ');
    })

    let categories_map = this.events.map(e => e.Category);
    this.categories = this.array_unique(categories_map);

    let status_map = this.events.map(e => e.Status);
    this.status = this.array_unique(status_map);

    this.max_date = this.events.map(e => e.EndDateTime).sort((a,b) => {
      if (a > b) return -1
      return 1
    })[0]

    this.loading = false;

    let scope = this;
    setTimeout(function() {
      scope.init_filters();
      scope.statistics_category();
      scope.statistics_order_reservation();
      scope.statistics_guest_reservation();
    }, 1);
  }

  init_filters() {
    document.getElementById('start-date').setAttribute('value', moment().format('YYYY-MM-DDTHH:mm:ss'));
    document.getElementById('end-date').setAttribute('value', this.max_date);
    this.filter_options = {
      name: '',
      category: '',
      status: '',
      start: moment().format('YYYY-MM-DDTHH:mm:ss'),
      end: moment(this.max_date).format('YYYY-MM-DDTHH:mm:ss')
    }
    this.events_filter();
  }

  events_filter() {
    this.filtered_events = this.events.filter(e => {
      var re_name = new RegExp(this.filter_options.name, 'i');
      if (!re_name.test(e.Name)) return false;

      var re_category = new RegExp(this.filter_options.category, 'i');
      if (!re_category.test(e.Category)) return false;

      var re_status = new RegExp(this.filter_options.status, 'i');
      if (!re_status.test(e.Status)) return false;
      
      if (e.StartDateTime < this.filter_options.start || e.EndDateTime > this.filter_options.end) return false;

      return true
    });
    console.log(this.filtered_events);
  }

  action_filter() {
    let filter_name = (<HTMLInputElement>document.getElementById('name')).value;
    let filter_category = (<HTMLInputElement>document.getElementById('category')).value;
    let filter_status = (<HTMLInputElement>document.getElementById('status')).value;
    let filter_start = (<HTMLInputElement>document.getElementById('start-date')).value;
    let filter_end = (<HTMLInputElement>document.getElementById('end-date')).value;

    this.filter_options = {
      name: filter_name,
      category: filter_category,
      status: filter_status,
      start: filter_start,
      end: filter_end
    }

    this.events_filter();
    this.statistics_category();
    this.statistics_order_reservation();
    this.statistics_guest_reservation();
  }

  statistics_category() {
    let categories = this.filtered_events.map(e => e.Category);
    let valid_categories = this.array_unique(categories);
    this.statistics_category_data = valid_categories.map(e => {
      let count = categories.filter(el => el === e).length;
      return {
        name : e + '(' + count + ')',
        value : count
      }
    })
  }

  statistics_order_reservation() {
    let reservation_ids = [];
    this.filtered_events.forEach(e => {
      e.Reservations.forEach(r => {
        reservation_ids.push(r.objectId);
      })
    })

    let orders = 0;
    let valid_reservations = this.reservations.filter(r => reservation_ids.indexOf(r.objectId)  !== -1);
    valid_reservations.forEach(r => {
      orders += r.Orders.length;
    })

    this.statistics_order_reservation_data = [
      {
        name: 'Orders per Reservation',
        value: orders/reservation_ids.length || 0
      }
    ]
  }

  statistics_guest_reservation() {
    let reservation_count = 0;
    let guest_count = 0;
    this.filtered_events.forEach(e => {
      e.Reservations.forEach(r => {
        reservation_count ++;
        guest_count += r.GuestAmount;
      })
    })

    this.statistics_guest_reservation_data = [
      {
        name: 'Guests per Reservation',
        value: guest_count/reservation_count || 0
      }
    ]
  }

  array_unique(arr) {
    return arr.filter(function(e, i) {
      return arr.indexOf(e) === i
    })
  }

  dateFormat(date) {
    return moment(date).format('YYYY-MM-DDTHH:mm:ss')
  }

  dateFormat2(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  }

}