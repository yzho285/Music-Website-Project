import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent implements OnInit {

  name: string = 'z'
  box: string = 'div-dom'


  constructor(
    private httpService:HttpService

    ) { }

  ngOnInit(): void {
  }

  createNewPlaylist(nameValue:any){
    this.httpService.createNewPlaylist(nameValue)
    .then(res =>{

    })



  }
}
