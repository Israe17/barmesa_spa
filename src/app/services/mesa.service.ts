
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Observable } from "rxjs";
import { Mesa } from "../models/mesa";

@Injectable({
  providedIn: 'root'
})

export class MesaService {


  public url: string;
  constructor(private _http: HttpClient) {
    this.url = server.url;
  }

  store(mesa: Mesa): Observable<any> {

    let userJson = JSON.stringify(mesa);
    let params = 'data=' + userJson;
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.post(this.url + 'mesa/store' , params, options);

  }

  getMesas(): Observable<any> {
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.get(this.url + 'mesa/', options);
  }









}
