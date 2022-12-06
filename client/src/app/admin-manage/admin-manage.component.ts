import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
const log = console.log

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.css']
})
export class AdminManageComponent implements OnInit {

  email = ''
  userid = ''
  password = ''
  deactivateEmail = ''
  activateEmail = ''
  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.userid = user.id
  }

  grantPrivilege(email:string) {
    this.httpService.adminPrivilege(email, '1', this.userid)
    .then(res => {
      if (res.status === 200) {
        alert("User gain admin privilege success");
        return res.json();
      } else if (res.status === 404) {
        alert("User does not exist");
        return
      } else {
        alert("Could not grant admin privilege to the user");
        return
      }
    })
    .catch(error => {
      console.log(error);
    })
  }

  deactivateOrActivateUser(email:string, status:string) {
    this.httpService.deactivateService(email, status, this.userid)
    .then(res => {
      if (res.status === 200) {
        if (status === '0') {
          alert("Deactivate Success")
          return
        } else {
          alert("Activate Success")
          return
        }
      } else if (res.status === 403) {
        alert("You are not admin")
        return
      } else {
        if (status === '0') {
          alert("Deactivate Failed")
          return
        } else {
          alert("Activate Failed")
          return
        }
      }
    })
    .catch(error => {
        console.log(error);
    })
  }

  updatePassword(password:string){
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    log(user)
    if (user) {
      this.httpService.passwrodUpdateService(user.id, password)
        .then(res => {
          if (res.status === 200) {
              alert("Update Success")
              return
          } else {
              alert("Update Failed")
              return
          }
        })
        .catch(error => {
            console.log(error);
        })
    }
  }

}
