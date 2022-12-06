import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service'
import { SharedService } from '../commonServices/shared-service'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

const log = console.log

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  students:any = []
  genres:any = []
  displayedColumns:string[] = ['genre_id', 'tracks', 'parent', 'title', 'top_level']
  searchTrackResult:any = []

  constructor(
    private httpService:HttpService, 
    private sharedService:SharedService, 
    private routerInfo:ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  getAllGenres() {
    this.httpService.getAllGenresService()
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get genres");
                return
            }
        })
        .then(json => {
            this.genres = json.genres
        })
        .catch(error => {
            console.log(error);
        })
  }

  searchTrack(e:Event) {
    const searchInput = 'awol';
    console.log("test");
    this.httpService.queryTracksService(searchInput)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          return res.json();
        } else {
          alert("Could not get tracks");
          return
        }
      })
      .then(json => {
        console.log("a")
        console.log(json);
        this.searchTrackResult = json.tracks
      })
      .catch(error => {
        console.log(error);
      })
  }
}
