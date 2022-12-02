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
}