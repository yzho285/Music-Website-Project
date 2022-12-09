import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../commonServices/http-service';
import {MatInputModule} from '@angular/material/input';
import { json } from 'express';
import { IntegerType } from 'mongodb';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { waitForAsync } from '@angular/core/testing';


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
  displayedColumnsUserPlaylists:string[] = ['listname', 'visible', 'totalPlaytime', 'track_number', 'description']
  columnsToDisplayUserPlaylists:string[] =['listname', 'visible', 'totalPlaytime', 'track_number', 'description']
  columnsToDisplayWithExpandUserPlaylists = [...this.columnsToDisplayUserPlaylists, 'expand']
  expandedElementUserPlaylists!: PeriodicElementUserPlaylists | null;
  username: string=JSON.parse(localStorage.getItem('currentUser') || '{}').userName
  trackid: string=''
  userid: string=JSON.parse(localStorage.getItem('currentUser') || '{}').id
  privacy: privTypes[] = [
    {privTypes: 'private'},
    {privTypes: 'public'}
  ];
  selectedType:string=''
  visible = this.selectedType==='public'? '1':'0'
//create
  description:string=''
  listname:string=''
  tracks:any=[]
  listinfo: listdata={
    listname: '',
    username: JSON.parse(localStorage.getItem('currentUser') || '{}').userName,
    userid: this.userid,
    tracks: '',
    description: '',
    visible: ''
  }
  //rating
  selectedRate:string=''
  rate:rateMarks[]=[
    {ratemark:'1'},
    {ratemark:'2'},
    {ratemark:'3'},
    {ratemark:'4'},
    {ratemark:'5'}
  ]

  constructor(
    private httpService:HttpService
    
    ) { 

    }

  ngOnInit(): void {
    this.getList(this.userid)
  }

  //get user's playlist
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
                      "tracks":json[i]["tracks"],
                      "description":json[i]["description"]
                    
                    };
        //console.log(temp);
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
//create new playlist
  createNewPlaylist(data:object){

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

    })
    .catch(error => {
      console.log(error);
    })
}
//deleting a playlist
deletelist(userid:string,listid:string){
  if (confirm('Are you sure?')){
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
    alert("Successfully deleted")
    this.getList(userid)
  }
  )
  .catch(error => {
    console.log(error);
  })
}
}
//add/remove track to a playlist
edittrack(trackid:string, playlistid:string, flag:string, userid:string){
  this.httpService.addOrDeleteATrack(trackid,playlistid,flag,userid)
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      return res.json();
    } else {
      alert("Could not edit list");
      return
    }
  })
  .then(res=>{
    alert("Successfully updated")
    this.getList(userid)
  })
  .catch(error => {
    console.log(error);
  }) 
}
//add rating to a playlist
rating(rating:string,playlistid:string){
  //console.log(rating)
  //console.log(playlistid)
  this.httpService.addRatingToPlaylist(rating,playlistid)
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      return res.json();
    } else {
      alert("Could not add rating");
      return
    }
  })
  .then(res=>{
    alert("Successfully rated")
    this.getList(this.userid)
  })
  .catch(error => {
    console.log(error);
  }) 
}
//add playlist review
review(){
  this.httpService.addReviewToPlaylist(){
    
  }
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
      description:string
    }

    export interface privTypes {
      privTypes: string;
    }

    export interface rateMarks{
      ratemark:string
    }