import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as moment from 'moment';

@Component({
  selector: 'app-event-create',
  templateUrl: './create.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EventCreateComponent {
}