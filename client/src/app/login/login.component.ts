import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
import { SharedService } from '../commonServices/shared-service'

import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

const log = console.log
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm:FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  constructor(
    private httpService:HttpService, 
    private sharedService:SharedService,
    private routerInfo:ActivatedRoute, 
    private router:Router
  ) { }

  ngOnInit(): void {}

  submitLoginForm() {
    this.httpService.loginService(this.loginForm.value)
      .then(res => {
        if (res.status === 200) {
            return res.json();
        } else if (res.status === 401) {
            alert("Login Failed, Email and password don't match!");
            return
        } else if (res.status === 400) {
          alert("Login Failed, User has been marked as deactivate user. Please contact site administrator.");
          return
        } else {
          alert("Login Failed");
          return
        }
      })
      .then(json => {
        // save current login user to localstorage
        log(json)
        localStorage.setItem('currentUser', JSON.stringify(json));
        this.sharedService.onLoginEvent.emit(json.userName);
        this.sharedService.onRoleEvent.emit(json.role);
        this.router.navigate(['/', 'example']);
      })
      .catch(e => {
        console.log(e)
      })
  }

}
