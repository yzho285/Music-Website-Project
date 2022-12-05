import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'

@Component({
  selector: 'app-unauthenticated-user',
  templateUrl: './unauthenticated-user.component.html',
  styleUrls: ['./unauthenticated-user.component.css']
})
export class UnauthenticatedUserComponent implements OnInit {

  searchTrackResult:any = []
  displayedColumns:string[] = ['track_title', 'artist_name']

  constructor(
    private httpService:HttpService
  ) { }

  ngOnInit(): void {
  }

  searchTrack(inputvalue:any) {
    this.httpService.queryTracksService(inputvalue)
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          return res.json();
        } else {
          alert("Could not get tracks");
          return
        }
      })
      .then(json => {
        console.log(json)
        this.searchTrackResult = json.tracks
      })
      .catch(error => {
        console.log(error);
      })
  }

}
