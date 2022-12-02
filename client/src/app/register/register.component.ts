import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
import { SharedService } from '../commonServices/shared-service'

import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
const log = console.log

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    userName: new FormControl('')
  })

  constructor(
    private httpService:HttpService, 
    private sharedService:SharedService,
    private routerInfo:ActivatedRoute, 
    private router:Router
  ) { }

  ngOnInit(): void {
  }

  submitRegisterForm() {
    this.registerForm.value.role = '2' // normal user
    this.registerForm.value.activate = '1' // activate user
    this.httpService.registerService(this.registerForm.value)
      .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            // alert("User Already exist");
            alert('User Already exist')
            return
        }
      })
      .then(json => {
        if (json != undefined) {
          console.log(json)
          // save current login user
          window.sessionStorage["currentUser"] = JSON.stringify(json)
          this.sharedService.onLoginEvent.emit(json?.userName);
          this.router.navigate(['/', 'example']);
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

}
