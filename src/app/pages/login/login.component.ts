import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import * as appconfig from '../../../../appconfig';
import 'rxjs/add/operator/map';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as Q from 'q';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  public router: Router;
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  constructor(
    router: Router,
    fb: FormBuilder,
    public http: Http) {
      this.router = router;
      this.form = fb.group({
          'email': ['', Validators.compose([Validators.required, CustomValidators.email])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
      });
      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
      if (this.form.valid) {
        console.log('Front-end validation success, send to backend');
        this.login();
          // this.router.navigate(['pages/dashboard']);
      }
  }
  private login() {
    const url: string = appconfig.data.apiUrl + 'functions/logIn';
    const headers = new Headers({
      'X-Parse-Application-Id' : appconfig.data.XParseApplicationId,
      'X-Parse-REST-API-Key': appconfig.data.XParseRESTAPIKey,
      'Content-Type': 'application/json'
    });
    const body = {username: this.email.value, password: this.password.value};
    const options = new RequestOptions({
      headers: headers,
      body: body
    });
    console.log('body', body);
    console.log('url', url);
    this.http.post(url, {}, options).map(res => res.json()).subscribe(res => {
      console.log('Success. Result from query:');
      console.log(res.result);
          // return this.navCtrl.setRoot(EventsListPage);
          this.router.navigate(['pages/dashboard'])
        .catch(err => {
          console.log('got error: ', err);
          return err;
        })
      return;
    });
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

}
