import { Component } from '@angular/core';
import { SharedService } from './commonServices/shared-service'
import { HttpService } from './commonServices/http-service'
const log  = console.log
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lab4-app';
  loginStatus:string = 'Login'
  constructor(private sharedService: SharedService, private httpService:HttpService) {
    sharedService.onLoginEvent.subscribe(
      (status:string) => {
        this.loginStatus = status;
      }
   );
  }
  ngOnInit(): void {
    // current login user
    log(window.sessionStorage["currentUser"])
  }

  logOut() {
    window.sessionStorage["currentUser"] = null
    this.sharedService.onLoginEvent.emit('Login')
    this.httpService.logoutService()
      .then(res => {
          if (res.status === 200) {
              log("Logout Success")
              return
          } else {
              log("Logout Failed")
              return
          }
      })
      .catch(error => {
          console.log(error);
      })
  }
}