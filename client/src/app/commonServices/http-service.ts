import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor() {}
    host:string = 'http://localhost:5000'
    //get all genres
    getAllGenresService() {
        const url = this.host + "/genres";
        return fetch(url)
    }
    // login
    loginService(data:object) {
        const url = this.host + "/users/login";
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        return fetch(request)
    }
    // logout
    logoutService() {
        const url = this.host + "/users/logout";
        return fetch(url)
    }
    // register
    registerService(data:object) {
        const url = this.host + "/users/signup";
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        return fetch(request)
    }
    // search tracks by using artist name, genre and track titke
    queryTracksService(keyword:string) {
        const url = this.host + "/public/tracks?" + new URLSearchParams({
            keyword: keyword
        })
        return fetch(url)
    }

    // get all playlists of a user
    queryAllPlaylistsOfUser(userid:string) {
        const url = this.host + "/playlists?" + new URLSearchParams({
            userid: userid
        })
        return fetch(url)
    }
    // create a new playlist
    // ex: 
    // data = {
    //    "listname": "test3",
    //    "username": "admin",
    //    "tracks": ["10", "134"],
    //    "description": "test!!!!!!!!!",
    //    "userid": "638c162f173a1714fb5d6a77",
    //     "description": optional,
    //     "visible": optional
    //}
    createNewPlaylist(data:object) {
        const url = this.host + "/playlist"
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        return fetch(request)
    }

    // update visibility and description of a playlist
    // ex:
    // data = {
    //    visible: '1'
    //    description: ''
    // }
    updateVisibleOrDescription(data:object) {
        const url = this.host + "/playlist/update"
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        return fetch(request)
    }

    // add or delete a track in a playlist
    // flag: '1' add, '0' delete
    addOrDeleteATrack(trackid:string, playlistid:string, flag:string){
        const url = this.host + "/playlist/tracks/update"
        const data = {
            trackid: trackid,
            playlistid: playlistid,
            updateOrDelete: flag
        }
        const request = new Request(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        return fetch(request)
    }

    // delete a playlist
    deletePlaylist(userid:string, listid:string ) {
        const url = this.host + "/playlist"
        const data = {
            userid: userid,
            listid: listid
        }
        const request = new Request(url, {
            method: "delete",
            body: JSON.stringify(data),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
        return fetch(request)
    }

}