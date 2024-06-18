import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { pedidoProducto } from "../models/pedidoproducto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PedidoProdService {
  public url: string;
  constructor(private _http: HttpClient) {
    this.url = server.url;
  }

  store(pedidoprod: pedidoProducto): Observable<any> {
    let userJson = JSON.stringify(pedidoprod);
    let params = 'data=' + userJson;
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.post(this.url + 'pedidoproducto/store', params, options);
  }




}
