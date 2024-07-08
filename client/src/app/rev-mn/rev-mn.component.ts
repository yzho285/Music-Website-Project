import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { SharedService } from '../commonServices/shared-service'
import { json } from 'express';
@Component({
  selector: 'app-rev-mn',
  templateUrl: './rev-mn.component.html',
  styleUrls: ['./rev-mn.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RevMnComponent implements OnInit {
  listResult:any=[]

  columnsToDisplayAllPlaylists:string[] =['listname']
  columnsToDisplayWithExpandAllPlaylists = [...this.columnsToDisplayAllPlaylists, 'expand']
  expandedAllPlaylists!: PeriodicElementAllPlaylists | null;

  constructor(
    private httpService:HttpService,
    private sharedService:SharedService,)
     { }

  ngOnInit(): void {
    this.getAll()
  }

getAll(){
  this.listResult=[]
  this.httpService.getAllPlaylist()
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      return res.json();
    } else {
      alert("Fail get lists");
      return
    }
  })
  .then(json=>{
    for(let i=0;i<json.playlists.length;i++){
      const temp = {"listname":json.playlists[i]["listname"],
                    "reviews":json.playlists[i]["reviews"],
                    "listid":json.playlists[i]['_id']
                  };
      //console.log(temp);
      this.listResult.push(temp);
  }
  console.log(this.listResult)
})
  .catch(error => {
    console.log(error);
  }) 
}
hide(playlistid:string,reviewid:string){
  const hid={
    "hidden":"1",
    "playlistid":"",
    "reviewid":""
  }
  hid.playlistid=playlistid
  hid.reviewid=reviewid
console.log(hid.reviewid)

  this.httpService.updateReviewHiddenStatus(hid)
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      alert("Successfully hide the review");
      return res.json();
    } else {
      alert("Fail to hide the review");
      return
    }
  })
  .then(res=>{
    this.getAll()
  })
  .catch(error => {
    console.log(error);
  }) 
}

unhide(playlistid:string,reviewid:string){
  const hid={
    "hidden":"0",
    "playlistid":"",
    "reviewid":""
  }
  hid.playlistid=playlistid
  hid.reviewid=reviewid
  console.log(hid.reviewid)
  this.httpService.updateReviewHiddenStatus(hid)
  .then(res => {
    if (res.status === 200) {
      console.log(res);

      alert("Successfully unhide the review");
      return res.json();
    } else {
      alert("Fail to unhide the review");
      return
    }
  })
  .then(res=>{
    this.getAll()
  })
  .catch(error => {
    console.log(error);
  }) 
}




}
export interface PeriodicElementAllPlaylists {
  listname: string;
  listid:string
}