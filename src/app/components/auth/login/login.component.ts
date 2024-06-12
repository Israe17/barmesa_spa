import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { user } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]
})
export class LoginComponent {
    public status:number ;
    public user:user;

    constructor(
        private _userService:UserService,
        private _router:Router,
        private _routes:ActivatedRoute
    ){
        this.status =-1;
        this.user = new user(1,"","","","","","","","");
    }

    onSubmit(form:any){
        this._userService.login(this.user).subscribe({
            next:(response:any)=>{
                if(response.status!=401){
                    sessionStorage.setItem("token",response);
                    this._userService.getIdentityFromAPI().subscribe({
                        next:(resp:any)=>{
                            sessionStorage.setItem("identity",JSON.stringify(resp));
                            this._router.navigate(['dashboard']);
                        },
                        error:(error:Error)=>{
                            console.log(error);
                        }
                    });
                }else{
                    this.status = 0;
                }
            },
            error:(error:any)=>{
                this.status = 1;
            }
        })
    }

}
