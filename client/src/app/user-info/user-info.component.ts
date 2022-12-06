import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
const log = console.log

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})

export class UserInfoComponent implements OnInit {
  password = '';
  constructor(private httpService:HttpService, ) { }

  ngOnInit(): void {
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
