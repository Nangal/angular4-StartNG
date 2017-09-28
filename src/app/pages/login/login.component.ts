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
      this.signIn(res.result)
        .then(() => {
          // return this.navCtrl.setRoot(EventsListPage);
        })
        .catch(err => {
          console.log('got error: ', err);
          return err;
        })
        .done();
    }, err => {
      console.log(err);
      console.log(err['_body']);
      console.log('error logging in: ' + err);
      // if((JSON.parse(err['_body'])['error'] === 'Email not verified')){
      //     let alert = this.resendAuthenticationPrompt({username: this.user.username, password: this.user.password, provider: 'standard'});
      //     return alert.present();
      // }
      // const alert = this.alertCtrl.create({
      //   title: 'Error logging in',
      //   subTitle: 'Failed to log in due to: ' + JSON.parse(err['_body'])['error'],
      //   buttons: [
      //     {
      //       text: 'OK',
      //       role: 'cancel',
      //       handler: data => {
      //         console.log('Ok clicked');
      //       }
      //     }
      //   ]
      // });
      // alert.present()
      //   .catch( err => {
      //     return err;
      //   });
      return;
    });
  }


  public signIn(userData) {
    // let nav = this.navCtrl;
    // console.log(this.navCtrl);
    // console.log(this.nav);
    // // console.log(this.navCtrl);
    // nav.setRoot(EventsListPage)
    //     .catch(err=>{
    //         console.log('error: '+err);
    //     });
    const originalScope = this;
    return Q.Promise(function(resolve, reject, notify){
      console.log('signing in user');
      console.log(userData);
      if (!userData.sessionToken) {
        console.log('no token');
        reject('no session token');
      }
      localStorage.set('userSession', userData)
        .then(res => {
          // console.log(originalScope);
          // console.log(originalScope.navCtrl);
          // return originalScope.navCtrl.setRoot(EventsListPage)
          return resolve('resolved');
        })
        // .then(res=>{
        //     console.log('success on navctrl');
        //     //Some logic if successful
        //     resolve('resolved');
        // })
        .catch(err => {
          console.log('could not sign in');
          console.log(err);
          reject(err);
        });
    });
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

}
