import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
import { SharedService } from '../commonServices/shared-service'

import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormGroup, FormControl, Validators} from '@angular/forms';

const log = console.log

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  verify = false
  userid = ''
  registerForm:FormGroup = new FormGroup({
    email: new FormControl(
      '', 
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur'
      }
    ),
    password: new FormControl(
      '', 
      {
        validators: [Validators.required],
        updateOn: 'blur'
      }
    ),
    userName: new FormControl(
      '', 
      {
        validators: [Validators.required],
        updateOn: 'blur'
      }
    ),
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
          this.verify = true // need verify
          this.userid = json.user.id
          this.registerForm.disable()
          // localStorage.setItem('token', json.token);
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  verifyEmail() {
    this.httpService.emailConfirmService(this.userid)
      .then(res => {
        if (res.status === 200) {
            alert('Your email address has been verified successfully')
            return res.json()
        } else {
            // alert("User Already exist");
            alert('Failed to verify the email')
            return
        }
      })
      .then(json => { // successfully verify email
        // save current login user
        log(json)
        localStorage.setItem('currentUser', JSON.stringify(json.user));
        localStorage.setItem('token', json.token);
        this.sharedService.onLoginEvent.emit(json.userName);
        this.router.navigate(['/', 'example']);

      })
  }

}
