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

  constructor(
    private httpService:HttpService, 
    private sharedService:SharedService, 
    private routerInfo:ActivatedRoute
  ) { }

  ngOnInit(): void {
    // log(this.routerInfo.snapshot.params)
    // log(this.routerInfo.snapshot.params['userEmail'])
    // log(this.routerInfo.snapshot.params['userId'])
    log(window.sessionStorage["currentUser"])
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
}