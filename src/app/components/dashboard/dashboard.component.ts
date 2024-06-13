import { Component } from '@angular/core';
import { RouterOutlet,RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { user } from '../../models/user';
import { server } from '../../services/global';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public identity:any
  public user:user
  private checkIdentity;
  public peticionDirectaImgUrl:string=server.url+'user/getimage/' ;
  constructor(
      private _userService:UserService
  ){
      this.checkIdentity= setInterval(()=>{
          this.identity = this._userService.getIdentityFromStorage();
      },500);
      this.user = new user(1,"","","","","","","","");
  }
  ngOnDestroy(){
      clearInterval(this.checkIdentity);
  }
}
