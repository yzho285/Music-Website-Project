import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service';
import {MatInputModule} from '@angular/material/input';
import { json } from 'express';
import { IntegerType } from 'mongodb';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class AuthUserComponent implements OnInit {


  YoutubeLink:string = ''
  lists:any=[]
  displayedColumnsUserPlaylists:string[] = ['listname', 'visible', 'totalPlaytime', 'track_number']
  columnsToDisplayUserPlaylists:string[] =['listname', 'visible', 'totalPlaytime', 'track_number']
  columnsToDisplayWithExpandUserPlaylists = [...this.columnsToDisplayUserPlaylists, 'expand']
  expandedElementUserPlaylists!: PeriodicElementUserPlaylists | null;

  userid: string=JSON.parse(localStorage.getItem('currentUser') || '{}').id

  description:string=''
  visible:string='0'
  listinfo: listdata={
    listname: '',
    username: JSON.parse(localStorage.getItem('currentUser') || '{}').userName,
    userid: this.userid,
    tracks: '',
    description: '',
    visible: ''
  }
  tst:any

  constructor(
    private httpService:HttpService
    
    ) { 

    }

  ngOnInit(): void {
  }

      // get all playlists of a user
    //   queryAllPlaylistsOfUser(userid:string) {
    //     const url = this.host + "/playlists?" + new URLSearchParams({
    //         userid: userid
    //     })
    //     return fetch(url)
    // }
  // getLists(){
  //   let userid = JSON.parse(localStorage.getItem('currentUser') || '{}').id
  //   this.httpService.queryAllPlaylistsOfUser(userid)
  //   .then(json => {
  //     this.genres = json.genres
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   })
  // }
  getList(userid:string){
    this.lists=[]
    this.httpService.queryAllPlaylistsOfUser(userid)
    .then(res => {
      if (res.status === 200) {
        //console.log(res);
        return res.json();
      } else {
        alert("could not get list");
        return
      }
    })
    .then(json => {
      for(let i=0;i<json.length;i++){
        const temp = {"listid":json[i]["_id"],
                      "listname":json[i]["listname"],
                      "visible":json[i]["visible"],
                      "totalPlaytime":json[i]["totalPlaytime"],
                      "track_number":json[i]["tracks"].length,
                      "tracks":json[i]["tracks"]};
        console.log(temp);
        this.lists.push(temp);
      }
      console.log(json);
    })
    .catch(error => {
      console.log(error);
    })
  }
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

  createNewPlaylist(data:listdata){

    console.log(data)
    //data.userid=JSON.parse(localStorage.getItem('currentUser') || '{}').id
    this.httpService.createNewPlaylist(data)
    .then(res => {
      if (res.status === 200) {
        console.log(res);
        return res.json();
      } else {
        alert("Could not create list");
        return
      }
    })
    .then(json =>{
      this.tst=json.result

    })
    .catch(error => {
      console.log(error);
    })
}

deletelist(userid:string,listid:string){
  this.httpService.deletePlaylist(userid,listid)
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      return res.json();
    } else {
      alert("Could not delete list");
      return
    }
  })
  .then(res=>{
    console.log(userid) 
  }
  )
  .catch(error => {
    console.log(error);
  })
}

edittrack(trackid:string, playlistid:string, flag:string, userid:string){
  this.httpService.addOrDeleteATrack(trackid,playlistid,flag,userid)
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      return res.json();
    } else {
      alert("Could not delete list");
      return
    }
  })
  .catch(error => {
    console.log(error);
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
      listname:string
      username: string
      userid: string
      tracks:string
      description:string
      visible:string
    }

    export interface PeriodicElementUserPlaylists {
      listid:string;
      listname: string;
      visible: string;
      totalPlaytime: string;
      track_number: string;
      tracks:string;
    }