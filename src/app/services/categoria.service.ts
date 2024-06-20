import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { categoria } from "../models/categoria";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
    public url:string;
    constructor(private _http:HttpClient){
        this.url = server.url;
    }


    store(cate:categoria):Observable<any>{
        console.log(cate);

        let userJson = JSON.stringify(cate);
        let params = 'data='+userJson;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options = {headers};
        return this._http.post(this.url+'categoria/store',params,options);
    }


    getCategorias():Observable<any>{
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};
      return this._http.get(this.url+'categoria/index',options);
    }

    deleteCategoria(id:number):Observable<any>{
        let headers;
        let bearerToken = sessionStorage.getItem('token');
        if(bearerToken){
            headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
        }else{
            headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        }
        let options = {headers};
        return this._http.delete(this.url+'categoria/delete/'+id);

    }

}
