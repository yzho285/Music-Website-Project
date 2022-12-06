import { EventEmitter, Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  onLoginEvent:EventEmitter<any> = new EventEmitter();
  onRoleEvent:EventEmitter<any> = new EventEmitter();

  constructor() {}

}
