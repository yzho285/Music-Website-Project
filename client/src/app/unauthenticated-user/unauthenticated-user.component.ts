import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-unauthenticated-user',
  templateUrl: './unauthenticated-user.component.html',
  styleUrls: ['./unauthenticated-user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UnauthenticatedUserComponent implements OnInit {

  searchTrackResult:any = []
  YoutubeLink:string = ''
  displayedColumns:string[] = ['track_title', 'artist_name']
  columnsToDisplay:string[] = ['track_title', 'artist_name']
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: PeriodicElement | null;

  constructor(
    private httpService:HttpService,
  ) { }

  ngOnInit(): void {
  }

  searchTrack(inputvalue:any) {
    this.searchTrackResult=[]
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
        for(let i=0;i<json.tracks.length;i++){
          const temp = {"track_title":json.tracks[i]["track_title"],
                        "artist_name":json.tracks[i]["artist_name"],
                        "track_duration":json.tracks[i]["track_duration"],
                        "track_favorites":json.tracks[i]["track_favorites"]}
          this.searchTrackResult.push(temp);
        }
        console.log(this.searchTrackResult);
        // this.searchTrackResult = json.tracks
      })
      .catch(error => {
        console.log(error);
      })
  }

  searchTrackDetail(element:any) {
    console.log(element.track_title);
  }

  goToYoutube(element:any){
    this.YoutubeLink = "https://www.youtube.com/results?" + new URLSearchParams({
      search_query: element.track_title
  })
    console.log(this.YoutubeLink)
    window.location.href=this.YoutubeLink
  }


}

export interface PeriodicElement {
  track_title: string;
  artist_name: string;
  track_duration: string;
  track_favorites: string;
}