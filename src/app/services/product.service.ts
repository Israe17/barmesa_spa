import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { product} from "../models/product";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    public url:string;
    constructor(private _http:HttpClient){
        this.url = server.url;
    }


    store(product:product):Observable<any>{
        let userJson = JSON.stringify(product);
        let params = 'data='+userJson;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options = {headers};
        return this._http.post(this.url+'producto/store',params,options);
    }

    update(product:product):Observable<any>{
        let userJson = JSON.stringify(product);
        let params = 'data='+userJson;
        let idProd=product.id;
        let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};
        return this._http.post(this.url+'producto/update/'+idProd,params,options);
    }

    delete(id: number): Observable<any> {
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};

      return this._http.delete(this.url + 'producto/' + id,options);
    }

    uploadImage(image: File): Observable<any> {
      const formularioDatos: FormData = new FormData();
      formularioDatos.append('file0', image, image.name);

      let headers = new HttpHeaders();
      const bearerToken = sessionStorage.getItem('token');

      if (bearerToken) {
        headers = headers.set('bearertoken', `${bearerToken}`);
      }

      return this._http.post(this.url + 'producto/upload', formularioDatos, { headers });
    }

  // Método para obtener una imagen
  getImage(filename: string): Observable<Blob> {
    debugger;
    let headers;
    let bearerToken = sessionStorage.getItem('token');
    if (bearerToken) {
        headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearerToken);
    } else {
        headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    }
    let options = { headers, responseType: 'blob' as 'json' };
    return this._http.get<Blob>(`${this.url}producto/getimage/${filename}`, options);
    }

  updateImage(image:File,filename:string){
     const formData = new FormData();
    formData.append('file0',image,image.name);
    let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
    }else{
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    }
      let options = { headers };
    return this._http.post(this.url+'producto/updateimage/'+filename,formData,options);
  }
  deleteImage(filename:string):Observable<any>{
    let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
    }else{
        headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    }
    let options = { headers };
    return this._http.delete('${this.url}producto/deleteimage/${filename}', options);
  }

    getProducts():Observable<any>{
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};
      return this._http.get(this.url+'producto/',options);
    }

    getProduct(id:number):Observable<any>{
      let headers;
      let bearerToken = sessionStorage.getItem('token');
      if(bearerToken){
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('bearertoken',bearerToken);
      }else{
          headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
      }
      let options = {headers};

      return this._http.get(this.url+'producto/'+id,options);
    }





}
