import { Component, OnInit, Type } from '@angular/core';
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

  YoutubeLink:string = ''
  searchTrackResult:any = []
  displayedColumns:string[] = ['track_title', 'artist_name']
  columnsToDisplay:string[] = ['track_title', 'artist_name']
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand']
  expandedElement!: PeriodicElement | null;
  PublicPlayList:any=[]
  displayedColumnsPublicPlaylists:string[] = ['listname', 'creator', 'totalPlaytime', 'track_number', 'avgrating']
  columnsToDisplayPublicPlaylists:string[] =['listname', 'creator', 'totalPlaytime', 'track_number', 'avgrating']
  columnsToDisplayWithExpandPublicPlaylists = [...this.columnsToDisplayPublicPlaylists, 'expand']
  expandedElementPublicPlaylists!: PeriodicElementPublicPlaylists | null;
  selectedType:string = ''
  requesttypes: requestTypes[] = [
    {requestTypes: 'notice'},
    {requestTypes: 'request'},
    {requestTypes: 'dispute'},
  ];
  policy:any[] = []
  policytemp:any={security:"", DMCA:"", AUP:""}
  displayedColumnsPolicy:string[] = ['security', 'DMCA', 'AUP']

  


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
                        "track_favorites":json.tracks[i]["track_favorites"],
                        "album_title":json.tracks[i]["album_title"],
                        "track_date_created":json.tracks[i]["track_date_created"]}
          this.searchTrackResult.push(temp);
        }
        console.log(this.searchTrackResult);
        // this.searchTrackResult = json.tracks
      })
      .catch(error => {
        console.log(error);
      })
  }

  // searchTrackDetail(element:any) {
  //   console.log(element.track_title);
  // }

  goToYoutube(element:any){
    this.YoutubeLink = "https://www.youtube.com/results?" + new URLSearchParams({
      search_query: element.track_title
  })
    console.log(this.YoutubeLink);
    // window.location.href=this.YoutubeLink
    window.open(this.YoutubeLink,'_blank');
  }

  goToYoutubeplaylist(element:any){
    this.YoutubeLink = "https://www.youtube.com/results?" + new URLSearchParams({
      search_query: element
  })
    // window.location.href=this.YoutubeLink
    console.log(element);
    window.open(this.YoutubeLink,'_blank');
  }

  getPublicPlaylist() {
    this.PublicPlayList=[]
    this.httpService.get10Playlist()
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          return res.json();
        } else {
          alert("Could not get public playlists");
          return
        }
      })
      .then(json => {
        for(let i=0;i<json.playlists.length;i++){
          const temp = {"listname":json.playlists[i]["listname"],
                        "creator":json.playlists[i]["username"],
                        "totalPlaytime":json.playlists[i]["totalPlaytime"],
                        "track_number":json.playlists[i]["tracks"].length,
                        "tracks":json.playlists[i]["tracks"],
                        "avgrating":json.playlists[i]["avgRating"]};
          // const temptrack = {"tracks":json.playlists[i]["tracks"]};
          console.log(temp);
          this.PublicPlayList.push(temp);
        }
        console.log(this.PublicPlayList);
      })
      .catch(error => {
        console.log(error);
      })
  }

  requestCopyrightFunc(request:any, email:any){
    // console.log(request);
    // console.log(email);
    // console.log(this.selectedType);
    if(email.includes('@')){
      this.httpService.sendMessageService(request,this.selectedType,email);
      alert('Request succeeded')
    }
    else{
      alert('Email address invalid')
    }
    
    
  }

  getallPolicy(){
    this.httpService.getPolicy("security")
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get security policy");
                return
            }
        })
        .then(json => {
            this.policytemp.security = json.policy[0].content;
        })
        .catch(error => {
            console.log(error);
        })
    this.httpService.getPolicy("DMCA")
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get DMCA policy");
                return
            }
        })
        .then(json => {
            this.policytemp.DMCA = json.policy[0].content
        })
        .catch(error => {
            console.log(error);
        })
    this.httpService.getPolicy("AUP")
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                alert("Could not get AUP policy");
                return
            }
        })
        .then(json => {
            this.policytemp.AUP = json.policy[0].content;
            this.policy.push(this.policytemp)

            console.log(this.policytemp)
            console.log(this.policy)
        })
        .catch(error => {
            console.log(error);
        })

  }




}

export interface PeriodicElement {
  track_title: string;
  artist_name: string;
  track_duration: string;
  track_favorites: string;
}

export interface PeriodicElementPublicPlaylists {
  listname: string;
  creator: string;
  totalPlaytime: string;
  track_number: string;
  tracks:string;
}

export interface requestTypes {
  requestTypes: string;
}


