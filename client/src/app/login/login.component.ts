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

  ngOnInit(): void {
    // window.sessionStorage["currentUser"] = ''
    log(this.routerInfo.snapshot.queryParams)
  }

  submitLoginForm() {
    this.httpService.loginService(this.loginForm.value)
      .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            alert("User doesn't exist");
            return
        }
      })
      .then(json => {
        console.log(json)
        // save current login user
        window.sessionStorage["currentUser"] = JSON.stringify(json)
        this.sharedService.onLoginEvent.emit(json.userName);
        // this.sharedService.setLoginStatus(json.userName)
        this.router.navigate(['/', 'example']);
      })
      .catch(e => {
        console.log(e)
      })
  }

}
