import { Component, OnInit } from '@angular/core';
import { HttpService } from '../commonServices/http-service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormGroup, FormControl, Validators} from '@angular/forms';


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
  role : string=JSON.parse(localStorage.getItem('currentUser')||'{}').role
  flag:boolean=true
  YoutubeLink:string = ''
  lists:any=[]
  displayedColumnsUserPlaylists:string[] = ['listname', 'visible', 'totalPlaytime', 'track_number', 'description','avgRating']
  columnsToDisplayUserPlaylists:string[] =['listname', 'visible', 'totalPlaytime', 'track_number', 'description','avgRating']
  columnsToDisplayWithExpandUserPlaylists = [...this.columnsToDisplayUserPlaylists, 'expand']
  expandedElementUserPlaylists!: PeriodicElementUserPlaylists | null;
  username: string=JSON.parse(localStorage.getItem('currentUser') || '{}').userName
  trackid: string=''
  userid: string=JSON.parse(localStorage.getItem('currentUser') || '{}').id
  // privacy: privTypes[] = [
  //   {privTypes: 'private'},
  //   {privTypes: 'public'}
  // ];
  // selectedType:string=''
  // visible = this.selectedType==='public'? '1':'0'
//create
listForm:FormGroup = new FormGroup({
  listname: new FormControl(
    '', 
    {
      validators: [Validators.required],
      updateOn: 'blur'
    }
  ),
  tracks: new FormControl(
    '', 
    {
      validators: [Validators.required],
      updateOn: 'blur'
    }
  ),
    description: new FormControl(''),
    visible: new FormControl
})
  listinfo: listdata={
    listname: '',
    username: JSON.parse(localStorage.getItem('currentUser') || '{}').userName,
    userid: this.userid,
    tracks: [],
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
  //reviews
  reviewing:string=''
  reviewinfo:reviews={
    review: '',
    playlistid: '',
    userid: this.userid,
    username: this.username,
    hidden: ''
  }

  constructor(
    private httpService:HttpService
    
    ) { 

    }

  ngOnInit(): void {
    this.getList(this.userid)
  }

  //get user's playlist
  getList(userid:string){
    console.log(this.role)
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
                      "description":json[i]["description"],
                      "avgRating":json[i]["avgRating"],
                      "reviews":json[i]["reviews"]
                    };
        //console.log(temp);
        this.lists.push(temp);
      }
      console.log(this.lists);
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
  createNewPlaylist(){
    this.listinfo.listname=this.listForm.value.listname
    this.listinfo.tracks=this.listForm.value.tracks.split(',')
    this.listinfo.description=this.listForm.value.description

    this.httpService.createNewPlaylist(this.listinfo)
    
    .then(res => {
      if (res.status === 200) {
        console.log(res);
        alert("New play list successfully created")
        return res.json();
      } else {
        this.flag=false
        alert("Could not create list");
        return
      }
    })
    .then(json =>{
      this.getList(this.userid)
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
      alert("Successfully deleted");
      return res.json();
    } else {
      alert("Could not delete list");
      return
    }
  })
  .then(res=>{
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
      alert("Successfully updated")
      return res.json();
    } else {
      alert("Could not edit list");
      return
    }
  })
  .then(res=>{

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
      alert("Successfully rated");
      return res.json();
    } else {
      alert("Could not add rating");
      return
    }
  })
  .then(res=>{

    this.getList(this.userid)
  })
  .catch(error => {
    console.log(error);
  }) 
}

//add playlist review
review(revtext:string,playlistid:string){

  this.reviewinfo.hidden='0'
  this.reviewinfo.review=revtext
  this.reviewinfo.playlistid=playlistid

  this.httpService.addReviewToPlaylist(this.reviewinfo)
  .then(res => {
    if (res.status === 200) {
      console.log(res);
      alert("Review successfully submited");
      return res.json();
    } else {
      alert("Fail to submit review");
      return
    }
  })
  .then(res=>{
    this.getList(this.userid)
  })
  .catch(error => {
    console.log(error);
  }) 
  
}
//change the playlist to public
publicing(userid:string){
  const pac={
    visible: '1',
    description: '',
    userid:''
  }
  pac.userid=userid
  console.log(pac)
  this.httpService.updateVisibleOrDescription(pac)
  .then(res => {
    if (res.status === 200) {
      console.log(res);

      alert("Successfully set to public");
      return res.json();
    } else {
      alert("Fail to set to public");
      return
    }
  })
  .then(res=>{
    this.getList(this.userid)
  })
  .catch(error => {
    console.log(error);
  }) 
  
}
//change review hidden state
    // data = {
    //    "hidden": "1",
    //    "playlistid": "638d54728c28b1151df70e1a",
    //    "reviewid": "1"
    // }
hide(playlistid:string,reviewid:string){
  const hid={
    "hidden":"1",
    "playlistid":"",
    "reviewid":""
  }
  hid.playlistid=playlistid
  hid.reviewid=reviewid
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
    this.getList(this.userid)
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
    this.getList(this.userid)
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
      tracks:[]
      description:string
      visible:string
      
    }
    // add a rating to the playlist
    // data = {
    //    "review": "This is a review!!!!!!!!",
    //    "playlistid": "638d54728c28b1151df70e1a",
    //    "userid": "638d582d24fb889e019fbd14",
    //    "username": "Admin1",
    //    "hidden": "0" // 1 hide, 0 public
    //}
    export interface reviews {
      review:string
      playlistid:string
      userid:string
      username:string
      hidden:string
    }



    export interface PeriodicElementUserPlaylists {
      listid:string;
      listname: string;
      visible: string;
      totalPlaytime: string;
      track_number: string;
      tracks:string;
      description:string;
      avgRating:string
      reviews:[]
    }

    export interface privTypes {
      privTypes: string;
    }

    export interface rateMarks{
      ratemark:string
    }