import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'

@Component({
  selector: 'app-unauthenticated-user',
  templateUrl: './unauthenticated-user.component.html',
  styleUrls: ['./unauthenticated-user.component.css']
})
export class UnauthenticatedUserComponent implements OnInit {

  searchTrackResult:any = []

  constructor(
    private httpService:HttpService
  ) { }

  ngOnInit(): void {
  }

  searchTrack(inputvalue:any) {
    const searchInput = inputvalue;
    this.httpService.queryTracksService(searchInput)
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          alert("Could not get tracks");
          return
        }
      })
      .then(json => {
        this.searchTrackResult = json.tracks
        console.log("a")
      })
      .catch(error => {
        console.log(error);
      })
  }

}
