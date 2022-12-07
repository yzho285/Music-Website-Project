import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css'],
  
})

export class AuthUserComponent implements OnInit {


  data!: listdata
  listname!: listdata["listname"]
  tracks!: listdata['tracks']
  description?: listdata['description']



  constructor(
    private httpService:HttpService

    ) { }

  ngOnInit(): void {
  }

  createNewPlaylist(data:object){
    this.httpService.createNewPlaylist(data)
    .then(json => {
  })
}
}
    // data = {
    //    "listname": "test3",
    //    "username": "admin",
    //    "tracks": ["10", "134"],
    //    "description": "test!!!!!!!!!",
    //    "userid": "638c162f173a1714fb5d6a77",
    //     "description": optional,
    //     "visible": optional
    //}
export interface listdata {
  listname: string;
  username: string
  tracks: string[]
  description:string
  userid: string
  visible: string

}