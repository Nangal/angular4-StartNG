import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class EventService {

  private event_url;
  private headers: Headers;

  constructor(
    private http: Http,
    @Inject('appService') private appService:any
  ){
    this.event_url = appService.apiUrl + 'functions/fetchDBTables';
    
    this.headers = new Headers({
      'X-Parse-Application-Id' : appService.XParseApplicationId,
      'X-Parse-REST-API-Key': appService.XParseRESTAPIKey,
      'Content-Type': 'application/json'
    });
  }

  tables() {

    const test_body = {
      user: {
        objectId: localStorage.getItem('userId'),
        sessionId: localStorage.getItem('sessionId')
      },
      includeRestricted: true
    };

    const options = new RequestOptions({
      headers: this.headers,
      body: test_body
    });

    return this.http.post(
      this.event_url,
      {},
      options
    ).map(res => res.json());
  }

}