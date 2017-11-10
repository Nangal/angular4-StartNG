import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
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
  
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;

  constructor(
    @Inject('loginService') private loginService:any,
    private router: Router,
    public http: Http,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, CustomValidators.email])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

  onSubmit(values: Object): void {
    if (this.form.valid) {
      this.loginService.login(this.email.value, this.password.value).subscribe(
        res => {
          localStorage.setItem('userId', res.result.objectId);
          localStorage.setItem('sessionId', res.result.sessionToken);
          this.router.navigate(['/dashboard'])
        },
        err => {
          console.log('err');
        }
      );
    }
  }
  
}