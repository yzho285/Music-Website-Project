import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
const log = console.log

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class UserInfoComponent implements OnInit {
  password = ''
  username = ''
  constructor(private httpService:HttpService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    this.username = user.userName
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
