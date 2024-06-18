import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Pedido } from "../models/pedido";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  public url: string;
  constructor(private _http: HttpClient) {
    this.url = server.url;
  }

  store(pedido: Pedido): Observable<any> {
    let userJson = JSON.stringify(pedido);
    let params = 'data=' + userJson;
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.post(this.url + 'pedido', params, options);
  }

  delete(id: number): Observable<any> {
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
      headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.delete(this.url + 'pedido/' + id, options);
  }




}

