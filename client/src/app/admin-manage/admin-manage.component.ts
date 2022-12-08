import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
import { SharedService } from '../commonServices/shared-service'
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

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
  messages:any[] = []
  messageType = ''
  displayedColumns:string[] = []
  types:any[] = [
    {value: 'security', label: 'Security'},
    {value: 'DMCA', label: 'DMCA'},
    {value: 'AUP', label: 'AUP'},
  ]
  newPolicy:string = '';
  selectType = new FormControl('')

  constructor(private httpService:HttpService, private sharedService:SharedService, ) {
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.userid = user.id
    this.sharedService.onLoginEvent.emit(user.userName);
    this.sharedService.onRoleEvent.emit(user.role);
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

  updatePolicy(){
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    log(this.newPolicy)
    if (user) {
      this.httpService.updatePolicyService(this.newPolicy, this.selectType.value || '')
        .then(res => {
          if (res.status === 200) {
              alert("Update Policy Success")
              return
          } else {
              alert("Update Policy Failed")
              return
          }
        })
        .catch(error => {
            console.log(error);
        })
    }
  }

  getAllMessages(type:string) {
    this.messageType = type
    this.httpService.getMessage(type)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get messages");
                return
            }
        })
        .then(json => {
            this.displayedColumns = ['type', 'contact', 'creationDate', 'content']
            this.messages = json.message
            log(this.messages)
            // this.genres = json.genres
        })
        .catch(error => {
            console.log(error);
        })
  }

  formatDate(time:Date){
    return moment(time).format('YYYY/MM/DD, HH:mm:ss')
  }

}
