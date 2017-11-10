import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  private url;
  private headers: Headers;

  constructor(
    private http: Http,
    @Inject('appService') private appService:any
  ){
    this.url = appService.apiUrl + 'functions/logIn';
    
    this.headers = new Headers({
      'X-Parse-Application-Id' : appService.XParseApplicationId,
      'X-Parse-REST-API-Key': appService.XParseRESTAPIKey,
      'Content-Type': 'application/json'
    });
  }

  login(email, password) {

    const body = {
      username: email,
      password: password
    };

    const options = new RequestOptions({
      headers: this.headers,
      body: body
    });

    return this.http.post(this.url, {}, options).map(res => res.json())
  }
}